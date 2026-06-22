import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentGateway, InvoiceStatus } from '@prisma/client';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly notifications: NotificationsService,
    ) { }

    private async createPaystackPaymentLink(invoice: any, clientEmail: string): Promise<string | null> {
        const paystackKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackKey) {
            this.logger.warn('PAYSTACK_SECRET_KEY not set — skipping payment link generation');
            return null;
        }
        try {
            const res = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${paystackKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: clientEmail,
                    amount: Math.round(Number(invoice.amount) * 100), // Paystack uses pesewas/kobo
                    currency: invoice.currency,
                    reference: invoice.invoiceNumber,
                    metadata: { invoice_id: invoice.id, invoice_number: invoice.invoiceNumber },
                    callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal`,
                }),
            });
            const data = await res.json() as any;
            if (data.status && data.data?.authorization_url) {
                return data.data.authorization_url as string;
            }
            this.logger.warn(`Paystack init failed: ${JSON.stringify(data)}`);
            return null;
        } catch (err) {
            this.logger.error('Paystack error', err);
            return null;
        }
    }

    private async createStripePaymentLink(invoice: any, clientEmail: string): Promise<string | null> {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            this.logger.warn('STRIPE_SECRET_KEY not set — skipping Stripe payment link');
            return null;
        }
        try {
            const params = new URLSearchParams({
                'payment_method_types[]': 'card',
                'line_items[0][price_data][currency]': invoice.currency.toLowerCase(),
                'line_items[0][price_data][unit_amount]': String(Math.round(Number(invoice.amount) * 100)),
                'line_items[0][price_data][product_data][name]': `Invoice ${invoice.invoiceNumber}`,
                'line_items[0][quantity]': '1',
                mode: 'payment',
                client_reference_id: invoice.id,
                customer_email: clientEmail,
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal?paid=1`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal`,
            });

            const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${stripeKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });
            const data = await res.json() as any;
            return data.url || null;
        } catch (err) {
            this.logger.error('Stripe error', err);
            return null;
        }
    }

    // ==========================================
    // READ OPERATIONS
    // ==========================================

    async getAllInvoices(status?: string, clientId?: string) {
        return this.prisma.invoice.findMany({
            where: {
                ...(status && { status: status as InvoiceStatus }),
                ...(clientId && { clientId }),
            },
            include: {
                client: { select: { id: true, companyName: true, contactName: true } },
                project: { select: { id: true, projectName: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }

    async getInvoicesByClient(clientId: string) {
        return this.prisma.invoice.findMany({
            where: { clientId },
            include: {
                project: { select: { id: true, projectName: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }

    async getAllSubscriptions(clientId?: string) {
        return this.prisma.subscription.findMany({
            where: clientId ? { clientId } : {},
            include: {
                client: { select: { id: true, companyName: true } },
            },
            orderBy: { nextBillingDate: 'asc' },
        });
    }

    async getBillingStats() {
        const [totalInvoiced, paidInvoices, overdueCount, activeSubscriptions] = await Promise.all([
            this.prisma.invoice.aggregate({ _sum: { amount: true } }),
            this.prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
            this.prisma.invoice.count({ where: { status: 'OVERDUE' } }),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        ]);

        const monthlyRecurring = await this.prisma.subscription.aggregate({
            _sum: { monthlyRate: true },
            where: { status: 'ACTIVE' },
        });

        return {
            totalInvoiced: totalInvoiced._sum.amount || 0,
            totalPaid: paidInvoices._sum.amount || 0,
            overdueCount,
            activeSubscriptions,
            monthlyRecurring: monthlyRecurring._sum.monthlyRate || 0,
        };
    }

    // ==========================================
    // WRITE OPERATIONS
    // ==========================================

    async generateInvoice(clientId: string, data: { amount: number; currency: string; projectId?: string; dueDate: Date }) {
        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            include: { user: { select: { email: true } } },
        });
        if (!client) throw new NotFoundException('Client not found for invoicing.');

        let selectedGateway: PaymentGateway = PaymentGateway.STRIPE;
        const normalizedCurrency = data.currency.toUpperCase();
        if (['GHS', 'NGN', 'ZAR'].includes(normalizedCurrency)) {
            selectedGateway = PaymentGateway.PAYSTACK;
        }

        const uniqueHash = Math.random().toString(36).substring(2, 6).toUpperCase();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${uniqueHash}`;

        try {
            const invoice = await this.prisma.invoice.create({
                data: {
                    invoiceNumber,
                    clientId,
                    projectId: data.projectId,
                    amount: data.amount,
                    currency: normalizedCurrency,
                    paymentGateway: selectedGateway,
                    dueDate: new Date(data.dueDate),
                    status: InvoiceStatus.DRAFT,
                },
            });

            this.logger.log(`Generated ${normalizedCurrency} Invoice ${invoiceNumber} routed via ${selectedGateway}`);

            // Generate real payment link
            let paymentLink: string | null = null;
            const clientEmail = client.user?.email || '';
            if (selectedGateway === PaymentGateway.PAYSTACK) {
                paymentLink = await this.createPaystackPaymentLink(invoice, clientEmail);
            } else {
                paymentLink = await this.createStripePaymentLink(invoice, clientEmail);
            }

            if (paymentLink) {
                await this.prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { pdfUrl: paymentLink, status: InvoiceStatus.SENT },
                });
            }

            // Email the client
            if (clientEmail) {
                await this.notifications.sendInvoiceNotification(clientEmail, {
                    invoiceNumber,
                    amount: data.amount,
                    currency: normalizedCurrency,
                    dueDate: new Date(data.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    paymentLink: paymentLink || undefined,
                });
            }

            return { ...invoice, paymentLink };
        } catch (error) {
            this.logger.error('Failed to generate invoice', error.stack);
            throw new InternalServerErrorException('Billing engine failure during invoice generation.');
        }
    }

    async updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
        return this.prisma.invoice.update({
            where: { id: invoiceId },
            data: { status, ...(status === 'PAID' ? { paidAt: new Date() } : {}) },
        });
    }

    async processPaystackWebhook(payload: any) {
        if (payload.event === 'charge.success') {
            const transactionId = payload.data.reference;
            const invoiceId = payload.data.metadata.invoice_id;

            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: InvoiceStatus.PAID, paidAt: new Date(), transactionId },
            });

            this.logger.log(`Paystack Payment Success. Invoice ${invoiceId} marked as PAID.`);
        }
        return { received: true };
    }

    async processStripeWebhook(payload: any) {
        if (payload.type === 'checkout.session.completed') {
            const session = payload.data.object;
            const invoiceId = session.client_reference_id;

            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: InvoiceStatus.PAID, paidAt: new Date(), transactionId: session.payment_intent },
            });

            this.logger.log(`Stripe Payment Success. Invoice ${invoiceId} marked as PAID.`);
        }
        return { received: true };
    }
}
