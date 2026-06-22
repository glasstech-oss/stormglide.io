import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortalService {
    constructor(private readonly prisma: PrismaService) { }

    async getClientPortalData(userId: string) {
        const profile = await this.prisma.clientProfile.findUnique({
            where: { userId },
            include: {
                user: { select: { id: true, email: true, lastLoginAt: true } },
                projects: {
                    include: {
                        milestones: { orderBy: { phase: 'asc' } },
                        feedback: {
                            where: { status: 'OPEN' },
                            orderBy: { createdAt: 'desc' },
                            take: 10,
                        },
                    },
                    orderBy: { startDate: 'desc' },
                },
                invoices: {
                    orderBy: { issuedAt: 'desc' },
                    take: 10,
                },
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    orderBy: { nextBillingDate: 'asc' },
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('Client profile not found. Please contact your account manager.');
        }

        // Calculate overall project progress
        const projects = profile.projects.map(project => {
            const PHASE_ORDER = ['DISCOVERY', 'UI_UX_DESIGN', 'BACKEND_ARCHITECTURE', 'STAGING', 'PRODUCTION', 'MAINTENANCE'];
            const currentIndex = PHASE_ORDER.indexOf(project.currentPhase);
            const progress = Math.round(((currentIndex + 1) / PHASE_ORDER.length) * 100);
            const completedMilestones = project.milestones.filter(m => m.isCompleted).length;

            return {
                ...project,
                progress,
                completedMilestones,
                totalMilestones: project.milestones.length,
            };
        });

        return {
            profile: {
                id: profile.id,
                companyName: profile.companyName,
                contactName: profile.contactName,
                industry: profile.industry,
                region: profile.region,
            },
            user: profile.user,
            projects,
            invoices: profile.invoices,
            subscriptions: profile.subscriptions,
        };
    }

    async submitFeedback(userId: string, projectId: string, data: { componentIdentifier: string; comment: string; screenX?: number; screenY?: number }) {
        const profile = await this.prisma.clientProfile.findUnique({ where: { userId } });
        if (!profile) throw new UnauthorizedException('Client profile not found.');

        // Verify the project belongs to this client
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, clientId: profile.id },
        });
        if (!project) throw new UnauthorizedException('You do not have access to this project.');

        return this.prisma.stagingFeedback.create({
            data: {
                projectId,
                clientId: profile.id,
                componentIdentifier: data.componentIdentifier,
                comment: data.comment,
                screenX: data.screenX,
                screenY: data.screenY,
            },
        });
    }
}
