import { Controller, Post, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { ProjectPhase, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/crm')
export class CrmController {
    constructor(private readonly crmService: CrmService) { }

    // ==========================================
    // READ ENDPOINTS
    // ==========================================

    @Get('clients')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getClients(@Query('search') search?: string) {
        return this.crmService.getAllClients(search);
    }

    @Get('clients/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getClient(@Param('id') id: string) {
        return this.crmService.getClientById(id);
    }

    @Get('projects')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getProjects() {
        return this.crmService.getAllProjects();
    }

    @Get('project/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getProject(@Param('id') id: string) {
        return this.crmService.getProjectById(id);
    }

    @Get('leads')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getLeads(@Query('status') status?: string) {
        return this.crmService.getAllLeads(status);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async getDashboardStats() {
        return this.crmService.getDashboardStats();
    }

    // ==========================================
    // WRITE ENDPOINTS
    // ==========================================

    @Post('lead')
    async createLead(@Body() body: { name: string; email: string; organization?: string; missionScope: string; details: string }) {
        return this.crmService.createLead(body);
    }

    @Post('client')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async createClient(@Body() body: { userId: string; companyName: string; contactName: string; whatsappNumber?: string; region?: string }) {
        return this.crmService.createClientProfile(body.userId, body);
    }

    @Post('project/:clientId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async createProject(@Param('clientId') clientId: string, @Body() body: { projectName: string; description: string; estimatedEnd: Date }) {
        return this.crmService.initializeProject(clientId, body);
    }

    @Put('project/:projectId/phase')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async updatePhase(@Param('projectId') projectId: string, @Body() body: { newPhase: ProjectPhase }) {
        return this.crmService.advanceProjectPhase(projectId, body.newPhase);
    }

    @Put('lead/:leadId/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async updateLeadStatus(@Param('leadId') leadId: string, @Body() body: { status: string }) {
        return this.crmService.updateLeadStatus(leadId, body.status);
    }

    @Post('project/:projectId/feedback')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA, Role.CLIENT)
    async submitFeedback(@Param('projectId') projectId: string, @Body() body: { clientId: string; componentIdentifier: string; comment: string; screenX: number; screenY: number }) {
        return this.crmService.logStagingFeedback(projectId, body.clientId, body);
    }

    @Post('clients/:id/portal-access')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OMEGA)
    async sendPortalAccess(@Param('id') id: string) {
        return this.crmService.sendPortalAccess(id);
    }
}
