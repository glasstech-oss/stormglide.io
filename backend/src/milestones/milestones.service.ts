import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectPhase } from '@prisma/client';

export interface CreateMilestoneDTO {
  projectId: string;
  phase: ProjectPhase;
  title: string;
  description?: string;
  targetDate?: Date;
  completionPercentage?: number;
}

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async createMilestone(data: CreateMilestoneDTO) {
    return this.prisma.projectMilestone.create({
      data: {
        projectId: data.projectId,
        phase: data.phase,
        title: data.title,
        description: data.description,
        targetDate: data.targetDate,
        completionPercentage: data.completionPercentage || 0,
        status: 'NOT_STARTED',
      },
      include: {
        project: true,
      },
    });
  }

  async getMilestonesByProject(projectId: string) {
    return this.prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: { targetDate: 'asc' },
    });
  }

  async getMilestonesByPhase(projectId: string, phase: ProjectPhase) {
    return this.prisma.projectMilestone.findMany({
      where: { projectId, phase },
      orderBy: { targetDate: 'asc' },
    });
  }

  async getMilestone(milestoneId: string) {
    return this.prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });
  }

  async updateMilestone(
    milestoneId: string,
    data: Partial<CreateMilestoneDTO>,
  ) {
    return this.prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        title: data.title,
        description: data.description,
        targetDate: data.targetDate,
        completionPercentage: data.completionPercentage,
        phase: data.phase,
      },
      include: { project: true },
    });
  }

  async updateMilestoneStatus(
    milestoneId: string,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETE',
    completionPercentage?: number,
  ) {
    return this.prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        status,
        completionPercentage: completionPercentage !== undefined ? completionPercentage : undefined,
        isCompleted: status === 'COMPLETE',
        completedAt: status === 'COMPLETE' ? new Date() : null,
      },
      include: { project: true },
    });
  }

  async deleteMilestone(milestoneId: string) {
    return this.prisma.projectMilestone.delete({
      where: { id: milestoneId },
    });
  }

  async updateProjectCompletionFromMilestones(projectId: string) {
    const milestones = await this.prisma.projectMilestone.findMany({
      where: { projectId },
    });

    if (milestones.length === 0) return;

    const avgCompletion =
      milestones.reduce((sum, m) => sum + m.completionPercentage, 0) /
      milestones.length;

    await this.prisma.projectCompletion.update({
      where: { projectId },
      data: {
        overallCompletionPercentage: Math.round(avgCompletion),
        lastAssessedAt: new Date(),
      },
    });
  }
}
