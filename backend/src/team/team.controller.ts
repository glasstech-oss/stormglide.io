import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TeamService } from './team.service';

interface CreateTeamMemberDTO {
  projectId: string;
  name: string;
  email: string;
  role: string;
  capacityAllocation: number;
  assignedPhases?: string[];
}

@Controller('v1/team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post()
  create(@Body() data: CreateTeamMemberDTO) {
    return this.teamService.createTeamMember({
      ...data,
      assignedPhases: data.assignedPhases || [],
    });
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId') projectId: string) {
    return this.teamService.getTeamByProject(projectId);
  }

  @Get('project/:projectId/capacity')
  getCapacity(@Param('projectId') projectId: string) {
    return this.teamService.getTeamCapacityUtilization(projectId);
  }

  @Get('project/:projectId/member/:memberId')
  getMember(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamService.getTeamMember(projectId, memberId);
  }

  @Put('project/:projectId/member/:memberId')
  update(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() data: Partial<CreateTeamMemberDTO>,
  ) {
    return this.teamService.updateTeamMember(projectId, memberId, data as any);
  }

  @Delete('project/:projectId/member/:memberId')
  delete(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamService.deleteTeamMember(projectId, memberId);
  }

  @Put('project/:projectId/member/:memberId/assign-phase')
  assignPhase(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() data: { phase: string },
  ) {
    return this.teamService.assignPhase(projectId, memberId, data.phase);
  }

  @Put('project/:projectId/member/:memberId/unassign-phase')
  unassignPhase(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() data: { phase: string },
  ) {
    return this.teamService.unassignPhase(projectId, memberId, data.phase);
  }
}
