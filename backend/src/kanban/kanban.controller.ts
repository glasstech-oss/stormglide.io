import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { KanbanService } from './kanban.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/kanban')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OMEGA)
export class KanbanController {
    constructor(private readonly kanbanService: KanbanService) { }

    @Get('tasks')
    async getTasks(@Query('projectId') projectId?: string, @Query('status') status?: string) {
        return this.kanbanService.getAllTasks(projectId, status);
    }

    @Get('board')
    async getBoard(@Query('projectId') projectId?: string) {
        return this.kanbanService.getKanbanBoard(projectId);
    }

    @Get('tasks/:id')
    async getTask(@Param('id') id: string) {
        return this.kanbanService.getTaskById(id);
    }

    @Post('tasks')
    async createTask(@Body() body: { title: string; description?: string; status?: string; priority?: string; projectId?: string; assigneeId?: string }) {
        return this.kanbanService.createTask(body);
    }

    @Put('tasks/:id')
    async updateTask(@Param('id') id: string, @Body() body: { title?: string; description?: string; status?: string; priority?: string; assigneeId?: string }) {
        return this.kanbanService.updateTask(id, body);
    }

    @Delete('tasks/:id')
    async deleteTask(@Param('id') id: string) {
        return this.kanbanService.deleteTask(id);
    }
}
