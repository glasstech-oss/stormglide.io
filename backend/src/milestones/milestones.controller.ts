import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  MilestonesService,
  CreateMilestoneDTO,
} from './milestones.service';
import { ProjectPhase } from '@prisma/client';

@Controller('v1/milestones')
export class MilestonesController {
  constructor(private milestonesService: MilestonesService) {}

  @Post()
  create(@Body() data: CreateMilestoneDTO) {
    return this.milestonesService.createMilestone(data);
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId') projectId: string) {
    return this.milestonesService.getMilestonesByProject(projectId);
  }

  @Get('project/:projectId/phase/:phase')
  getByPhase(
    @Param('projectId') projectId: string,
    @Param('phase') phase: ProjectPhase,
  ) {
    return this.milestonesService.getMilestonesByPhase(projectId, phase);
  }

  @Get(':id')
  get(@Param('id') milestoneId: string) {
    return this.milestonesService.getMilestone(milestoneId);
  }

  @Put(':id')
  update(@Param('id') milestoneId: string, @Body() data: Partial<CreateMilestoneDTO>) {
    return this.milestonesService.updateMilestone(milestoneId, data);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') milestoneId: string,
    @Body() data: { status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETE'; completionPercentage?: number },
  ) {
    return this.milestonesService.updateMilestoneStatus(
      milestoneId,
      data.status,
      data.completionPercentage,
    );
  }

  @Delete(':id')
  delete(@Param('id') milestoneId: string) {
    return this.milestonesService.deleteMilestone(milestoneId);
  }
}
