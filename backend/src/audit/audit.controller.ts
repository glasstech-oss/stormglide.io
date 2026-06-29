import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OMEGA)
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get('logs')
    async getLogs(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('entityType') entityType?: string
    ) {
        return this.auditService.getLogs(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 50,
            entityType
        );
    }

    @Post('logs')
    async createLog(@Body() body: { adminId: string; action: string; entityType: string; entityId: string; ipAddress?: string }) {
        return this.auditService.createLog(body);
    }

    @Get('project/:projectId')
    async getProjectHistory(
        @Query('limit') limit?: string
    ) {
        return this.auditService.getProjectHistory(
            limit ? parseInt(limit) : 50
        );
    }

    @Get('entity/:entityType/:entityId')
    async getEntityHistory(
        @Query('limit') limit?: string
    ) {
        return this.auditService.getEntityHistory(
            limit ? parseInt(limit) : 50
        );
    }
}
