import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectPhase } from '@prisma/client';

@Injectable()
export class CrmService {
    private readonly logger = new Logger(CrmService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * 1. Register a new Client Profile linked to a User Account
     */
    async createClientProfile(userId: string, data: { companyName: string; contactName: string; whatsappNumber?: string; industry?: string; region?: string }) {
        try {
            const profile = await this.prisma.clientProfile.create({
                data: {
                    userId,
                    companyName: data.companyName,
                    contactName: data.contactName,
                    whatsappNumber: data.whatsappNumber,
                    industry: data.industry,
                    region: data.region || 'GLOBAL',
                },
            });
            this.logger.log(`Client Profile created for company: ${data.companyName}`);
            return profile;
        } catch (error) {
            this.logger.error('Failed to create client profile', error.stack);
            throw new BadRequestException('Could not create client profile. Ensure User ID exists.');
        }
    }

    /**
     * 2. Initialize a Project & Generate the Secure Job ID
     */
    async initializeProject(clientId: string, data: { projectName: string; description?: string; estimatedEnd?: Date }) {
        // Verify client exists
        const client = await this.prisma.clientProfile.findUnique({ where: { id: clientId } });
        if (!client) throw new NotFoundException('Client profile not found.');

        const project = await this.prisma.project.create({
            data: {
                clientId,
                projectName: data.projectName,
                description: data.description,
                currentPhase: ProjectPhase.DISCOVERY,
                estimatedEnd: data.estimatedEnd,
            },
        });

        // Automatically generate the default milestones for the Tracker UI
        await this.prisma.projectMilestone.createMany({
            data: [
                { projectId: project.id, phase: ProjectPhase.DISCOVERY, title: 'Deep Discovery & Requirements Gathering' },
                { projectId: project.id, phase: ProjectPhase.UI_UX_DESIGN, title: 'UI/UX Interactive Prototyping' },
                { projectId: project.id, phase: ProjectPhase.BACKEND_ARCHITECTURE, title: 'Database Schema & API Architecture' },
                { projectId: project.id, phase: ProjectPhase.STAGING, title: 'Live Staging Sandbox Deployment' },
                { projectId: project.id, phase: ProjectPhase.PRODUCTION, title: 'Production Launch & Handover' },
            ],
        });

        this.logger.log(`Project initialized. Job ID: ${project.id} assigned to ${client.companyName}`);
        return project;
    }

    /**
     * 3. Update Project Phase (Moves the progress bar on the Client Portal)
     */
    async advanceProjectPhase(projectId: string, newPhase: ProjectPhase) {
        const project = await this.prisma.project.update({
            where: { id: projectId },
            data: { currentPhase: newPhase },
            include: { client: true }
        });

        // Mark previous milestones as completed based on timeline logic
        await this.prisma.projectMilestone.updateMany({
            where: { projectId, phase: newPhase },
            data: { isCompleted: true, completedAt: new Date() }
        });

        this.logger.log(`Project ${project.projectName} advanced to ${newPhase}. Notify client via CRM.`);
        return project;
    }

    /**
     * 4. Log Staging Feedback (From the Client's Live Sandbox UI)
     */
    async logStagingFeedback(projectId: string, clientId: string, data: { componentIdentifier: string; comment: string; screenX?: number; screenY?: number }) {
        const feedback = await this.prisma.stagingFeedback.create({
            data: {
                projectId,
                clientId,
                componentIdentifier: data.componentIdentifier,
                comment: data.comment,
                screenX: data.screenX,
                screenY: data.screenY,
            },
        });

        // In a full environment, this triggers a WebSocket event to your Admin Dashboard
        this.logger.log(`New Staging Feedback received for Project ID: ${projectId}`);
        return feedback;
    }
}
