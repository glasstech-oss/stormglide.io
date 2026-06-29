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
import { ProjectsService, CreateProjectDTO, UpdateProjectDTO } from './projects.service';
import { ProjectPhase, ProjectCompletionStatus } from '@prisma/client';

@Controller('v1/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  create(@Body() data: CreateProjectDTO) {
    return this.projectsService.createProject(data);
  }

  @Get()
  list(
    @Query('clientId') clientId?: string,
    @Query('phase') phase?: ProjectPhase,
    @Query('status') status?: ProjectCompletionStatus,
  ) {
    return this.projectsService.listProjects(clientId, phase, status);
  }

  @Get(':id')
  getProject(@Param('id') projectId: string) {
    return this.projectsService.getProject(projectId);
  }

  @Put(':id')
  update(@Param('id') projectId: string, @Body() data: UpdateProjectDTO) {
    return this.projectsService.updateProject(projectId, data);
  }

  @Put(':id/phase')
  advancePhase(@Param('id') projectId: string) {
    return this.projectsService.advancePhase(projectId);
  }

  @Get(':id/health')
  getHealth(@Param('id') projectId: string) {
    return this.projectsService.getProjectHealth(projectId);
  }

  @Put(':id/health')
  updateHealth(
    @Param('id') projectId: string,
    @Body() data: Partial<{
      overallCompletionPercentage: number;
      status: ProjectCompletionStatus;
      riskFactors: string[];
      healthScore: number;
      estimatedCompletionDate: Date;
      actualCompletionDate: Date;
    }>,
  ) {
    return this.projectsService.updateProjectHealth(projectId, data);
  }

  @Delete(':id')
  delete(@Param('id') projectId: string) {
    return this.projectsService.deleteProject(projectId);
  }
}
