import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { CrmService } from './crm.service';
import { ProjectPhase } from '@prisma/client';

// Note: In production, inject your JWT Auth Guard here to protect these endpoints
// @UseGuards(JwtAuthGuard)
@Controller('v1/crm')
export class CrmController {
    constructor(private readonly crmService: CrmService) { }

    @Post('client')
    async createClient(@Body() body: { userId: string; companyName: string; contactName: string; whatsappNumber?: string; region?: string }) {
        return await this.crmService.createClientProfile(body.userId, body);
    }

    @Post('project/:clientId')
    async createProject(@Param('clientId') clientId: string, @Body() body: { projectName: string; description: string; estimatedEnd: Date }) {
        return await this.crmService.initializeProject(clientId, body);
    }

    @Put('project/:projectId/phase')
    async updatePhase(@Param('projectId') projectId: string, @Body() body: { newPhase: ProjectPhase }) {
        return await this.crmService.advanceProjectPhase(projectId, body.newPhase);
    }

    @Post('project/:projectId/feedback')
    async submitFeedback(@Param('projectId') projectId: string, @Body() body: { clientId: string; componentIdentifier: string; comment: string; screenX: number; screenY: number }) {
        return await this.crmService.logStagingFeedback(projectId, body.clientId, body);
    }
}
