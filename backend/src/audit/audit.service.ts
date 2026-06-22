import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private readonly prisma: PrismaService) { }

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

    async createLog(data: { adminId: string; action: string; entityType: string; entityId: string; ipAddress?: string }) {
        return this.prisma.auditLog.create({ data });
    }
}
