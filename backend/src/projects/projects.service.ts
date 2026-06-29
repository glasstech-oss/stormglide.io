import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectPhase, ProjectCompletionStatus } from '@prisma/client';

export interface CreateProjectDTO {
  clientId: string;
  projectName: string;
  description?: string;
  estimatedEnd?: Date;
}

export interface UpdateProjectDTO {
  projectName?: string;
  description?: string;
  currentPhase?: ProjectPhase;
  estimatedEnd?: Date;
  completedAt?: Date;
}

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(data: CreateProjectDTO) {
    return this.prisma.project.create({
      data: {
        clientId: data.clientId,
        projectName: data.projectName,
        description: data.description,
        estimatedEnd: data.estimatedEnd,
        completion: {
          create: {
            overallCompletionPercentage: 0,
            currentPhase: ProjectPhase.DISCOVERY,
            status: ProjectCompletionStatus.ON_TRACK,
            healthScore: 5,
          },
        },
        stack: {
          create: {},
        },
      },
      include: {
        client: true,
        completion: true,
        stack: true,
        milestones: true,
        domains: true,
        subscriptions: true,
      },
    });
  }

  async getProject(projectId: string) {
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        completion: true,
        stack: true,
        milestones: true,
        domains: true,
        subscriptions: true,
        invoices: true,
      },
    });
  }

  async listProjects(clientId?: string, phase?: ProjectPhase, status?: ProjectCompletionStatus) {
    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (phase) where.currentPhase = phase;
    if (status) where.completion = { status };

    return this.prisma.project.findMany({
      where,
      include: {
        client: true,
        completion: true,
        _count: {
          select: {
            milestones: true,
            domains: true,
            subscriptions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProject(projectId: string, data: UpdateProjectDTO) {
    return this.prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        client: true,
        completion: true,
        stack: true,
      },
    });
  }

  async advancePhase(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { completion: true },
    });

    if (!project) throw new Error('Project not found');

    const phaseOrder = [
      ProjectPhase.DISCOVERY,
      ProjectPhase.UI_UX_DESIGN,
      ProjectPhase.BACKEND_ARCHITECTURE,
      ProjectPhase.STAGING,
      ProjectPhase.PRODUCTION,
      ProjectPhase.MAINTENANCE,
    ];

    const currentIndex = phaseOrder.indexOf(project.currentPhase);
    const nextPhase = phaseOrder[currentIndex + 1];

    if (!nextPhase) return project; // Already at MAINTENANCE

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        currentPhase: nextPhase,
        completion: {
          update: { currentPhase: nextPhase },
        },
      },
      include: {
        client: true,
        completion: true,
      },
    });
  }

  async getProjectHealth(projectId: string) {
    return this.prisma.projectCompletion.findUnique({
      where: { projectId },
    });
  }

  async updateProjectHealth(projectId: string, data: Partial<{
    overallCompletionPercentage: number;
    status: ProjectCompletionStatus;
    riskFactors: string[];
    healthScore: number;
    estimatedCompletionDate: Date;
    actualCompletionDate: Date;
  }>) {
    return this.prisma.projectCompletion.update({
      where: { projectId },
      data: {
        ...data,
        lastAssessedAt: new Date(),
      },
    });
  }

  async deleteProject(projectId: string) {
    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}
