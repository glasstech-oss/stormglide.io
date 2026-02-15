import { Controller, Post, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('v1/billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Post('invoice/:clientId')
    async createInvoice(
        @Param('clientId') clientId: string,
        @Body() body: { amount: number; currency: string; projectId?: string; dueDate: Date }
    ) {
        return await this.billingService.generateInvoice(clientId, body);
    }

    // ==========================================
    // WEBHOOK ENDPOINTS (Exposed to the public)
    // ==========================================

    @Post('webhook/paystack')
    @HttpCode(HttpStatus.OK)
    async handlePaystackWebhook(@Body() body: any, @Headers('x-paystack-signature') signature: string) {
        // In a live environment, validate the signature using your Paystack Secret Key
        return await this.billingService.processPaystackWebhook(body);
    }

    @Post('webhook/stripe')
    @HttpCode(HttpStatus.OK)
    async handleStripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
        // In a live environment, validate the signature using your Stripe Endpoint Secret
        return await this.billingService.processStripeWebhook(body);
    }
}
