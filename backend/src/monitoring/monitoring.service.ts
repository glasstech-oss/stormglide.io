import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MonitoringService {
    private readonly logger = new Logger(MonitoringService.name);

    constructor(private readonly prisma: PrismaService) { }

    async getInfraSnapshots(clientId?: string) {
        return this.prisma.infraSnapshot.findMany({
            where: clientId ? { clientId } : {},
            include: {
                client: { select: { id: true, companyName: true } },
                project: { select: { id: true, projectName: true } },
            },
            orderBy: { checkedAt: 'desc' },
        });
    }

    async getLatestSnapshotPerClient() {
        const clients = await this.prisma.clientProfile.findMany({
            select: { id: true, companyName: true, contactName: true },
        });

        const snapshots = await Promise.all(
            clients.map(async (client) => {
                const latest = await this.prisma.infraSnapshot.findMany({
                    where: { clientId: client.id },
                    orderBy: { checkedAt: 'desc' },
                    take: 20,
                });
                return { client, snapshots: latest };
            })
        );

        return snapshots;
    }

    async getAllAlerts(resolved?: boolean) {
        return this.prisma.alertRecord.findMany({
            where: resolved !== undefined ? { resolved } : {},
            include: {
                client: { select: { id: true, companyName: true } },
            },
            orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        });
    }

    async resolveAlert(alertId: string, resolvedBy?: string) {
        return this.prisma.alertRecord.update({
            where: { id: alertId },
            data: { resolved: true, resolvedAt: new Date(), resolvedBy },
        });
    }

    async reopenAlert(alertId: string) {
        return this.prisma.alertRecord.update({
            where: { id: alertId },
            data: { resolved: false, resolvedAt: null, resolvedBy: null },
        });
    }

    async createAlert(data: { type: string; severity: string; title: string; description: string; clientId?: string; clientName?: string }) {
        return this.prisma.alertRecord.create({ data });
    }

    async recordSnapshot(data: { clientId: string; projectId?: string; checkType: string; target: string; status: string; details: object }) {
        const snapshot = await this.prisma.infraSnapshot.create({ data: { ...data, details: data.details as any } });

        // Auto-create alert if status is critical or warning
        if (data.status === 'CRITICAL' || data.status === 'WARNING') {
            const client = await this.prisma.clientProfile.findUnique({ where: { id: data.clientId }, select: { companyName: true } });
            await this.prisma.alertRecord.create({
                data: {
                    type: data.checkType,
                    severity: data.status === 'CRITICAL' ? 'critical' : 'high',
                    title: `${data.checkType} ${data.status} — ${data.target}`,
                    description: `Automated monitoring detected a ${data.status.toLowerCase()} condition for ${data.target}`,
                    clientId: data.clientId,
                    clientName: client?.companyName,
                },
            });
            this.logger.warn(`Alert created: ${data.checkType} ${data.status} for ${data.target}`);
        }

        return snapshot;
    }

    async getAlertStats() {
        const [critical, high, medium, low, unresolved] = await Promise.all([
            this.prisma.alertRecord.count({ where: { severity: 'critical', resolved: false } }),
            this.prisma.alertRecord.count({ where: { severity: 'high', resolved: false } }),
            this.prisma.alertRecord.count({ where: { severity: 'medium', resolved: false } }),
            this.prisma.alertRecord.count({ where: { severity: 'low', resolved: false } }),
            this.prisma.alertRecord.count({ where: { resolved: false } }),
        ]);
        return { critical, high, medium, low, unresolved };
    }

    async getDocuments(clientId?: string, type?: string) {
        return this.prisma.document.findMany({
            where: {
                ...(clientId && { clientId }),
                ...(type && { type }),
            },
            include: {
                client: { select: { id: true, companyName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createDocument(data: { clientId: string; type: string; title: string; status: string; fileUrl?: string; fileSize?: string; uploadedBy?: string }) {
        return this.prisma.document.create({ data });
    }

    async updateDocumentStatus(docId: string, status: string) {
        return this.prisma.document.update({ where: { id: docId }, data: { status } });
    }
}
