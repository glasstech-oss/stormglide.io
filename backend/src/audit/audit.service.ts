import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAuditLogDTO {
  action: string;
  entityType: string;
  entityId: string;
  adminId: string;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(data: CreateAuditLogDTO) {
    return this.prisma.auditLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        adminId: data.adminId,
        ipAddress: data.ipAddress,
        timestamp: new Date(),
      },
    });
  }

  async getLogs(page = 1, limit = 50, entityType?: string) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: entityType ? { entityType } : {},
        include: {
          admin: { select: { id: true, email: true, role: true } },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where: entityType ? { entityType } : {} }),
    ]);

    return { logs, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getProjectHistory(projectId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: {
        entityId: projectId,
      },
      include: {
        admin: { select: { id: true, email: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getEntityHistory(
    entityType: string,
    entityId: string,
    limit = 50,
  ) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        admin: { select: { id: true, email: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async createLog(data: CreateAuditLogDTO) {
    return this.prisma.auditLog.create({ data });
  }
}
