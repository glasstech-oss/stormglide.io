import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OMEGA)
export class MonitoringController {
    constructor(private readonly monitoringService: MonitoringService) { }

    // ==========================================
    // INFRASTRUCTURE SNAPSHOTS
    // ==========================================

    @Get('infra')
    async getSnapshots(@Query('clientId') clientId?: string) {
        return this.monitoringService.getInfraSnapshots(clientId);
    }

    @Get('infra/summary')
    async getInfraSummary() {
        return this.monitoringService.getLatestSnapshotPerClient();
    }

    @Post('infra/snapshot')
    async recordSnapshot(@Body() body: { clientId: string; projectId?: string; checkType: string; target: string; status: string; details: object }) {
        return this.monitoringService.recordSnapshot(body);
    }

    // ==========================================
    // ALERT RECORDS
    // ==========================================

    @Get('alerts')
    async getAlerts(@Query('resolved') resolvedStr?: string) {
        const resolved = resolvedStr === 'true' ? true : resolvedStr === 'false' ? false : undefined;
        return this.monitoringService.getAllAlerts(resolved);
    }

    @Get('alerts/stats')
    async getAlertStats() {
        return this.monitoringService.getAlertStats();
    }

    @Post('alerts')
    async createAlert(@Body() body: { type: string; severity: string; title: string; description: string; clientId?: string; clientName?: string }) {
        return this.monitoringService.createAlert(body);
    }

    @Put('alerts/:id/resolve')
    async resolveAlert(@Param('id') id: string, @Body() body: { resolvedBy?: string }) {
        return this.monitoringService.resolveAlert(id, body.resolvedBy);
    }

    @Put('alerts/:id/reopen')
    async reopenAlert(@Param('id') id: string) {
        return this.monitoringService.reopenAlert(id);
    }

    // ==========================================
    // DOCUMENT VAULT
    // ==========================================

    @Get('documents')
    async getDocuments(@Query('clientId') clientId?: string, @Query('type') type?: string) {
        return this.monitoringService.getDocuments(clientId, type);
    }

    @Post('documents')
    async createDocument(@Body() body: { clientId: string; type: string; title: string; status: string; fileUrl?: string; fileSize?: string; uploadedBy?: string }) {
        return this.monitoringService.createDocument(body);
    }

    @Put('documents/:id/status')
    async updateDocumentStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.monitoringService.updateDocumentStatus(id, body.status);
    }
}
