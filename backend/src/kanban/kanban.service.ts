import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KanbanService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllTasks(projectId?: string, status?: string) {
        return this.prisma.kanbanTask.findMany({
            where: {
                ...(projectId && { projectId }),
                ...(status && { status }),
            },
            include: {
                project: { select: { id: true, projectName: true, client: { select: { companyName: true } } } },
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        });
    }

    async getTaskById(taskId: string) {
        const task = await this.prisma.kanbanTask.findUnique({
            where: { id: taskId },
            include: { project: { include: { client: true } } },
        });
        if (!task) throw new NotFoundException('Task not found.');
        return task;
    }

    async createTask(data: { title: string; description?: string; status?: string; priority?: string; projectId?: string; assigneeId?: string }) {
        return this.prisma.kanbanTask.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status || 'BACKLOG',
                priority: data.priority || 'MEDIUM',
                projectId: data.projectId,
                assigneeId: data.assigneeId,
            },
        });
    }

    async updateTask(taskId: string, data: { title?: string; description?: string; status?: string; priority?: string; assigneeId?: string }) {
        await this.getTaskById(taskId);
        return this.prisma.kanbanTask.update({
            where: { id: taskId },
            data,
        });
    }

    async deleteTask(taskId: string) {
        await this.getTaskById(taskId);
        return this.prisma.kanbanTask.delete({ where: { id: taskId } });
    }

    async getKanbanBoard(projectId?: string) {
        const tasks = await this.getAllTasks(projectId);
        const columns = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DEPLOYED'];
        return columns.reduce((board, col) => {
            board[col] = tasks.filter(t => t.status === col);
            return board;
        }, {} as Record<string, typeof tasks>);
    }
}
