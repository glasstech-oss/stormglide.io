import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ProjectPhase } from '@prisma/client';

@Injectable()
export class CrmService {
    private readonly logger = new Logger(CrmService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
        private readonly notifications: NotificationsService,
    ) { }

    // ==========================================
    // READ OPERATIONS
    // ==========================================

    async getAllClients(search?: string) {
        const where = search
            ? {
                OR: [
                    { companyName: { contains: search, mode: 'insensitive' as const } },
                    { contactName: { contains: search, mode: 'insensitive' as const } },
                    { user: { email: { contains: search, mode: 'insensitive' as const } } },
                ],
            }
            : {};

        return this.prisma.clientProfile.findMany({
            where,
            include: {
                user: { select: { id: true, email: true, role: true, lastLoginAt: true } },
                projects: {
                    select: {
                        id: true, projectName: true, currentPhase: true,
                        stagingUrl: true, productionUrl: true, startDate: true, estimatedEnd: true,
                    },
                },
                invoices: { select: { id: true, invoiceNumber: true, amount: true, currency: true, status: true, dueDate: true, paidAt: true } },
                subscriptions: { select: { id: true, serviceName: true, monthlyRate: true, currency: true, status: true, nextBillingDate: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getClientById(clientId: string) {
        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            include: {
                user: { select: { id: true, email: true, role: true, lastLoginAt: true, createdAt: true } },
                projects: {
                    include: {
                        milestones: { orderBy: { phase: 'asc' } },
                        feedback: { where: { status: 'OPEN' }, orderBy: { createdAt: 'desc' }, take: 5 },
                    },
                    orderBy: { startDate: 'desc' },
                },
                invoices: { orderBy: { issuedAt: 'desc' } },
                subscriptions: { orderBy: { nextBillingDate: 'asc' } },
                documents: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!client) throw new NotFoundException('Client not found.');
        return client;
    }

    async getAllProjects() {
        return this.prisma.project.findMany({
            include: {
                client: { select: { id: true, companyName: true, contactName: true, whatsappNumber: true } },
                milestones: { orderBy: { phase: 'asc' } },
                feedback: { where: { status: 'OPEN' }, select: { id: true, comment: true, status: true, createdAt: true } },
            },
            orderBy: { startDate: 'desc' },
        });
    }

    async getProjectById(projectId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                client: true,
                milestones: { orderBy: { phase: 'asc' } },
                feedback: { orderBy: { createdAt: 'desc' } },
                invoices: { orderBy: { issuedAt: 'desc' } },
                kanbanTasks: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!project) throw new NotFoundException('Project not found.');
        return project;
    }

    async getAllLeads(status?: string) {
        return this.prisma.lead.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateLeadStatus(leadId: string, status: string) {
        return this.prisma.lead.update({
            where: { id: leadId },
            data: { status },
        });
    }

    async getDashboardStats() {
        const [clientCount, projectCount, openFeedback, leadCount] = await Promise.all([
            this.prisma.clientProfile.count(),
            this.prisma.project.count(),
            this.prisma.stagingFeedback.count({ where: { status: 'OPEN' } }),
            this.prisma.lead.count({ where: { status: 'NEW' } }),
        ]);

        const activeProjects = await this.prisma.project.groupBy({
            by: ['currentPhase'],
            _count: { id: true },
        });

        return { clientCount, projectCount, openFeedback, leadCount, activeProjects };
    }

    // ==========================================
    // WRITE OPERATIONS
    // ==========================================

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

    async initializeProject(clientId: string, data: { projectName: string; description?: string; estimatedEnd?: Date }) {
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

        await this.prisma.projectMilestone.createMany({
            data: [
                { projectId: project.id, phase: ProjectPhase.DISCOVERY, title: 'Deep Discovery & Requirements Gathering', description: 'Conduct stakeholder interviews, define user personas, map business processes, and finalize the full technical requirements document.' },
                { projectId: project.id, phase: ProjectPhase.UI_UX_DESIGN, title: 'UI/UX Interactive Prototyping', description: 'Design high-fidelity wireframes and interactive prototypes in Figma. Present for client review and approval before any code is written.' },
                { projectId: project.id, phase: ProjectPhase.BACKEND_ARCHITECTURE, title: 'Database Schema & API Architecture', description: 'Architect the Prisma schema, design RESTful or GraphQL APIs, set up cloud infrastructure (AWS/GCP/DigitalOcean), and configure CI/CD pipelines.' },
                { projectId: project.id, phase: ProjectPhase.STAGING, title: 'Live Staging Sandbox Deployment', description: 'Deploy to staging environment, conduct QA, and open the live sandbox for client feedback using the visual annotation tool.' },
                { projectId: project.id, phase: ProjectPhase.PRODUCTION, title: 'Production Launch & Handover', description: 'Final performance optimization, security audit, DNS cutover, and full handover documentation for ongoing maintenance.' },
            ],
        });

        this.logger.log(`Project initialized. Job ID: ${project.id} assigned to ${client.companyName}`);
        return project;
    }

    async advanceProjectPhase(projectId: string, newPhase: ProjectPhase) {
        const project = await this.prisma.project.update({
            where: { id: projectId },
            data: { currentPhase: newPhase },
            include: { client: { include: { user: { select: { email: true } } } } },
        });

        await this.prisma.projectMilestone.updateMany({
            where: { projectId, phase: newPhase },
            data: { isCompleted: true, completedAt: new Date() },
        });

        this.logger.log(`Project ${project.projectName} advanced to ${newPhase}.`);

        const clientEmail = (project.client as any).user?.email;
        if (clientEmail) {
            const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal`;
            await this.notifications.sendPhaseAdvanceNotification(clientEmail, {
                clientName: project.client.companyName,
                projectName: project.projectName,
                newPhase: newPhase.replace(/_/g, ' '),
                portalUrl,
            }).catch(err => this.logger.warn(`Phase notification failed: ${err.message}`));
        }

        return project;
    }

    async sendPortalAccess(clientId: string): Promise<{ message: string }> {
        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            include: { user: { select: { email: true } } },
        });
        if (!client) throw new NotFoundException('Client not found.');
        if (!client.user?.email) throw new BadRequestException('Client has no linked user account with an email address.');

        await this.authService.requestMagicLink(client.user.email);
        this.logger.log(`Portal access link dispatched to ${client.user.email} for ${client.companyName}`);
        return { message: `Portal access link sent to ${client.user.email}` };
    }

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
        this.logger.log(`New Staging Feedback received for Project ID: ${projectId}`);
        return feedback;
    }

    async createLead(data: { name: string; email: string; organization?: string; missionScope: string; details: string }) {
        try {
            const lead = await this.prisma.lead.create({
                data: {
                    name: data.name,
                    email: data.email,
                    organization: data.organization,
                    missionScope: data.missionScope,
                    details: data.details,
                },
            });
            this.logger.log(`New Lead registered: ${data.name} (${data.organization || 'Individual'})`);
            return lead;
        } catch (error) {
            this.logger.error('Failed to register lead', error.stack);
            throw new BadRequestException('Could not process mission briefing.');
        }
    }
}
