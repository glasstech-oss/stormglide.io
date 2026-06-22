import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as tls from 'tls';
import * as https from 'https';
import * as http from 'http';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly notifications: NotificationsService,
    ) { }

    // ─── Run every 6 hours ────────────────────────────────────────────
    @Cron('0 */6 * * *')
    async runMonitoringCycle() {
        this.logger.log('Starting monitoring cycle...');
        const projects = await this.prisma.project.findMany({
            include: { client: { select: { id: true, companyName: true, user: { select: { email: true } } } } },
            where: {
                OR: [
                    { stagingUrl: { not: null } },
                    { productionUrl: { not: null } },
                ],
            },
        });

        for (const project of projects) {
            const urls = [project.productionUrl, project.stagingUrl].filter(Boolean) as string[];
            for (const url of urls) {
                try {
                    const hostname = new URL(url).hostname;
                    await Promise.all([
                        this.checkSSL(project.client.id, project.id, hostname),
                        this.checkUptime(project.client.id, project.id, url),
                    ]);
                } catch (err) {
                    this.logger.error(`Monitor error for ${url}`, err.message);
                }
            }
        }
        this.logger.log(`Monitoring cycle complete. Checked ${projects.length} projects.`);
    }

    // ─── SSL Certificate Check ────────────────────────────────────────
    async checkSSL(clientId: string, projectId: string, hostname: string): Promise<void> {
        return new Promise((resolve) => {
            const socket = tls.connect(443, hostname, { servername: hostname, rejectUnauthorized: false }, async () => {
                try {
                    const cert = socket.getPeerCertificate();
                    socket.destroy();

                    if (!cert || !cert.valid_to) {
                        await this.recordSnapshot(clientId, projectId, 'SSL', hostname, 'UNKNOWN', { error: 'No certificate data' });
                        return resolve();
                    }

                    const expiresAt = new Date(cert.valid_to);
                    const daysLeft = Math.floor((expiresAt.getTime() - Date.now()) / 86400000);
                    const issuer = cert.issuer?.O || 'Unknown';
                    const valid = socket.authorized !== false || daysLeft > 0;

                    let status: 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';
                    if (daysLeft <= 0) status = 'CRITICAL';
                    else if (daysLeft <= 14) status = 'WARNING';

                    await this.recordSnapshot(clientId, projectId, 'SSL', hostname, status, {
                        issuer, expiresAt: expiresAt.toISOString(), daysLeft, valid,
                    });

                    if (status !== 'HEALTHY') {
                        await this.createAlertIfNew(clientId, 'SSL', status === 'CRITICAL' ? 'critical' : 'high',
                            `SSL cert ${status === 'CRITICAL' ? 'expired' : 'expiring soon'} — ${hostname}`,
                            `Certificate expires in ${daysLeft} days (${expiresAt.toDateString()})`,
                        );
                    }
                } catch (err) {
                    socket.destroy();
                    await this.recordSnapshot(clientId, projectId, 'SSL', hostname, 'UNKNOWN', { error: err.message });
                }
                resolve();
            });

            socket.on('error', async (err) => {
                await this.recordSnapshot(clientId, projectId, 'SSL', hostname, 'CRITICAL', { error: err.message });
                await this.createAlertIfNew(clientId, 'SSL', 'critical', `SSL check failed — ${hostname}`, err.message);
                resolve();
            });
            socket.setTimeout(10000, () => { socket.destroy(); resolve(); });
        });
    }

    // ─── HTTP Uptime Check ────────────────────────────────────────────
    async checkUptime(clientId: string, projectId: string, url: string): Promise<void> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const lib = url.startsWith('https') ? https : http;
            const req = lib.get(url, { timeout: 10000 }, async (res) => {
                const latencyMs = Date.now() - startTime;
                const statusCode = res.statusCode || 0;
                res.resume(); // drain response

                let status: 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';
                if (statusCode >= 500) status = 'CRITICAL';
                else if (statusCode >= 400 || latencyMs > 3000) status = 'WARNING';

                await this.recordSnapshot(clientId, projectId, 'UPTIME', url, status, {
                    statusCode, latencyMs, checkedAt: new Date().toISOString(),
                });

                if (status !== 'HEALTHY') {
                    await this.createAlertIfNew(clientId, 'UPTIME', status === 'CRITICAL' ? 'critical' : 'medium',
                        `${status === 'CRITICAL' ? 'Site down' : 'Slow response'} — ${new URL(url).hostname}`,
                        `Status ${statusCode}, latency ${latencyMs}ms`,
                    );
                }
                resolve();
            });

            req.on('error', async (err) => {
                await this.recordSnapshot(clientId, projectId, 'UPTIME', url, 'CRITICAL', { error: err.message });
                await this.createAlertIfNew(clientId, 'UPTIME', 'critical',
                    `Site unreachable — ${new URL(url).hostname}`, err.message,
                );
                resolve();
            });
            req.on('timeout', async () => {
                req.destroy();
                await this.recordSnapshot(clientId, projectId, 'UPTIME', url, 'WARNING', { error: 'Request timed out after 10s' });
                resolve();
            });
        });
    }

    // ─── Helpers ──────────────────────────────────────────────────────
    private async recordSnapshot(clientId: string, projectId: string, checkType: string, target: string, status: string, details: object) {
        await this.prisma.infraSnapshot.create({
            data: { clientId, projectId, checkType, target, status, details: details as any },
        });
    }

    private async createAlertIfNew(clientId: string, type: string, severity: string, title: string, description: string) {
        // Check if an unresolved alert of same type+client already exists — avoid spam
        const existing = await this.prisma.alertRecord.findFirst({
            where: { clientId, type, title, resolved: false },
        });
        if (existing) return;

        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            select: { companyName: true },
        });

        const alert = await this.prisma.alertRecord.create({
            data: { type, severity, title, description, clientId, clientName: client?.companyName },
        });

        // Email admin for critical and high alerts
        if (severity === 'critical' || severity === 'high') {
            await this.notifications.sendAlertNotification({
                title, description, severity, clientName: client?.companyName,
            });
        }

        this.logger.warn(`Alert created [${severity}]: ${title}`);
    }

    // ─── Domain expiry check (every 24h) ─────────────────────────────
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkDomainExpiry() {
        this.logger.log('Checking domain expiry via snapshot history...');
        // Check snapshots that haven't been updated in 7+ days and flag them
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
        const staleClients = await this.prisma.clientProfile.findMany({
            where: {
                infraSnapshots: {
                    none: { checkType: 'DOMAIN', checkedAt: { gte: sevenDaysAgo } },
                },
            },
            select: { id: true, companyName: true },
        });

        for (const client of staleClients) {
            await this.createAlertIfNew(
                client.id, 'DOMAIN', 'medium',
                `Domain monitoring gap — ${client.companyName}`,
                'No domain check recorded in the last 7 days. Configure WHOIS API key to enable automated expiry monitoring.',
            );
        }
    }
}
