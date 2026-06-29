import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TeamMember {
  id: string;
  projectId: string;
  name: string;
  email: string;
  role: string;
  capacityAllocation: number; // 0-100
  assignedPhases: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Since team members aren't in the Prisma schema yet, we'll store them in a simple way
// In a real app, you'd add a TeamMember model to the schema

const teamMembers: Map<string, TeamMember[]> = new Map();

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async createTeamMember(data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) {
    const member: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!teamMembers.has(data.projectId)) {
      teamMembers.set(data.projectId, []);
    }
    teamMembers.get(data.projectId)!.push(member);
    return member;
  }

  async getTeamByProject(projectId: string) {
    return teamMembers.get(projectId) || [];
  }

  async getTeamMember(projectId: string, memberId: string) {
    const team = teamMembers.get(projectId) || [];
    return team.find((m) => m.id === memberId);
  }

  async updateTeamMember(
    projectId: string,
    memberId: string,
    data: Partial<TeamMember>,
  ) {
    const team = teamMembers.get(projectId) || [];
    const index = team.findIndex((m) => m.id === memberId);
    if (index === -1) return null;

    team[index] = { ...team[index], ...data, updatedAt: new Date() };
    return team[index];
  }

  async deleteTeamMember(projectId: string, memberId: string) {
    const team = teamMembers.get(projectId) || [];
    const filtered = team.filter((m) => m.id !== memberId);
    teamMembers.set(projectId, filtered);
    return true;
  }

  async getTeamCapacityUtilization(projectId: string) {
    const team = await this.getTeamByProject(projectId);
    const totalCapacity = team.reduce((sum, m) => sum + m.capacityAllocation, 0);
    const avgCapacity = team.length > 0 ? totalCapacity / team.length : 0;

    return {
      teamSize: team.length,
      totalAllocated: totalCapacity,
      averageCapacity: Math.round(avgCapacity),
      members: team,
    };
  }

  async assignPhase(projectId: string, memberId: string, phase: string) {
    const member = await this.getTeamMember(projectId, memberId);
    if (!member) return null;

    if (!member.assignedPhases.includes(phase)) {
      member.assignedPhases.push(phase);
    }
    return this.updateTeamMember(projectId, memberId, member);
  }

  async unassignPhase(projectId: string, memberId: string, phase: string) {
    const member = await this.getTeamMember(projectId, memberId);
    if (!member) return null;

    member.assignedPhases = member.assignedPhases.filter((p) => p !== phase);
    return this.updateTeamMember(projectId, memberId, member);
  }
}
