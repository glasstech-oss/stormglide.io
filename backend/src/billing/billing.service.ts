import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentGateway, InvoiceStatus } from '@prisma/client';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * 1. Generate an Invoice with Smart Gateway Routing
     */
    async generateInvoice(clientId: string, data: { amount: number; currency: string; projectId?: string; dueDate: Date }) {
        const client = await this.prisma.clientProfile.findUnique({ where: { id: clientId } });
        if (!client) throw new NotFoundException('Client not found for invoicing.');

        // Smart Gateway Routing Logic
        let selectedGateway: PaymentGateway = PaymentGateway.STRIPE;
        const normalizedCurrency = data.currency.toUpperCase();

        // Route West African currencies to Paystack for seamless Mobile Money/Local Card processing
        if (['GHS', 'NGN', 'ZAR'].includes(normalizedCurrency)) {
            selectedGateway = PaymentGateway.PAYSTACK;
        }

        // Generate unique Invoice Number (e.g., INV-2026-X8F9)
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
                    dueDate: data.dueDate,
                    status: InvoiceStatus.DRAFT,
                },
            });

            this.logger.log(`Generated ${normalizedCurrency} Invoice ${invoiceNumber} routed via ${selectedGateway}`);

            // TODO: Here you would invoke Stripe SDK or Paystack API to generate the actual payment link
            // const paymentLink = await this.createGatewayLink(invoice);

            return invoice;
        } catch (error) {
            this.logger.error('Failed to generate invoice', error.stack);
            throw new InternalServerErrorException('Billing engine failure during invoice generation.');
        }
    }

    /**
     * 2. Handle Paystack Webhooks (For Mobile Money / Local Card Success)
     */
    async processPaystackWebhook(payload: any) {
        // Verify Paystack signature in production here
        if (payload.event === 'charge.success') {
            const transactionId = payload.data.reference;
            // Assume the invoice ID was passed in the metadata during payment creation
            const invoiceId = payload.data.metadata.invoice_id;

            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: InvoiceStatus.PAID,
                    paidAt: new Date(),
                    transactionId: transactionId,
                },
            });

            this.logger.log(`Paystack Payment Success. Invoice ${invoiceId} marked as PAID via Mobile Money/Card.`);
        }
        return { received: true };
    }

    /**
     * 3. Handle Stripe Webhooks (For International Credit Card Success)
     */
    async processStripeWebhook(payload: any) {
        // Verify Stripe signature in production here
        if (payload.type === 'checkout.session.completed') {
            const session = payload.data.object;
            const invoiceId = session.client_reference_id;

            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: InvoiceStatus.PAID,
                    paidAt: new Date(),
                    transactionId: session.payment_intent,
                },
            });

            this.logger.log(`Stripe Payment Success. Invoice ${invoiceId} marked as PAID via Credit Card.`);
        }
        return { received: true };
    }
}
