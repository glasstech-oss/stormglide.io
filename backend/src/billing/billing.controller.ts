import { Controller, Post, Body, Param, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Post('invoice/:clientId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
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
        // Validation logic should be implemented in the Service layer or a specific WebhookGuard
        return await this.billingService.processPaystackWebhook(body);
    }

    @Post('webhook/stripe')
    @HttpCode(HttpStatus.OK)
    async handleStripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
        return await this.billingService.processStripeWebhook(body);
    }
}
