import { Controller, Get, Post, Put, Body, Param, Query, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Role, InvoiceStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    // ==========================================
    // READ ENDPOINTS
    // ==========================================

    @Get('invoices')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getInvoices(@Query('status') status?: string, @Query('clientId') clientId?: string) {
        return this.billingService.getAllInvoices(status, clientId);
    }

    @Get('invoices/:clientId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA, Role.CLIENT)
    async getClientInvoices(@Param('clientId') clientId: string) {
        return this.billingService.getInvoicesByClient(clientId);
    }

    @Get('subscriptions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getSubscriptions(@Query('clientId') clientId?: string) {
        return this.billingService.getAllSubscriptions(clientId);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getBillingStats() {
        return this.billingService.getBillingStats();
    }

    // ==========================================
    // WRITE ENDPOINTS
    // ==========================================

    @Post('invoice/:clientId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async createInvoice(
        @Param('clientId') clientId: string,
        @Body() body: { amount: number; currency: string; projectId?: string; dueDate: Date }
    ) {
        return this.billingService.generateInvoice(clientId, body);
    }

    @Put('invoice/:invoiceId/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async updateInvoiceStatus(@Param('invoiceId') invoiceId: string, @Body() body: { status: InvoiceStatus }) {
        return this.billingService.updateInvoiceStatus(invoiceId, body.status);
    }

    // ==========================================
    // WEBHOOK ENDPOINTS
    // ==========================================

    @Post('webhook/paystack')
    @HttpCode(HttpStatus.OK)
    async handlePaystackWebhook(@Body() body: any, @Headers('x-paystack-signature') signature: string) {
        return this.billingService.processPaystackWebhook(body);
    }

    @Post('webhook/stripe')
    @HttpCode(HttpStatus.OK)
    async handleStripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
        return this.billingService.processStripeWebhook(body);
    }
}
