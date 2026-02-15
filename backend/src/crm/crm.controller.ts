import { Controller, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { ProjectPhase, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/crm')
export class CrmController {
    constructor(private readonly crmService: CrmService) { }

    @Post('lead')
    async createLead(@Body() body: { name: string; email: string; organization?: string; missionScope: string; details: string }) {
        return await this.crmService.createLead(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('client')
    @Roles(Role.ADMIN)
    async createClient(@Body() body: { userId: string; companyName: string; contactName: string; whatsappNumber?: string; region?: string }) {
        return await this.crmService.createClientProfile(body.userId, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('project/:clientId')
    @Roles(Role.ADMIN)
    async createProject(@Param('clientId') clientId: string, @Body() body: { projectName: string; description: string; estimatedEnd: Date }) {
        return await this.crmService.initializeProject(clientId, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('project/:projectId/phase')
    @Roles(Role.ADMIN)
    async updatePhase(@Param('projectId') projectId: string, @Body() body: { newPhase: ProjectPhase }) {
        return await this.crmService.advanceProjectPhase(projectId, body.newPhase);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('project/:projectId/feedback')
    @Roles(Role.ADMIN, Role.CLIENT)
    async submitFeedback(@Param('projectId') projectId: string, @Body() body: { clientId: string; componentIdentifier: string; comment: string; screenX: number; screenY: number }) {
        return await this.crmService.logStagingFeedback(projectId, body.clientId, body);
    }
}
