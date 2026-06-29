import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertType, AlertChannel } from '@prisma/client';
import { DomainsService } from '../domains/domains.service';
import { ProjectSubscriptionsService } from '../subscriptions/project-subscriptions.service';

export interface CreateAlertTriggerDTO {
  type: AlertType;
  daysBeforeExpiry: number;
  channels?: AlertChannel[];
  recipients?: string[];
  enabled?: boolean;
}

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private domainsService: DomainsService,
    private subscriptionsService: ProjectSubscriptionsService,
  ) {}

  async createAlertTrigger(data: CreateAlertTriggerDTO) {
    return this.prisma.alertTrigger.create({
      data: {
        type: data.type,
        daysBeforeExpiry: data.daysBeforeExpiry,
        channels: data.channels ?? [AlertChannel.IN_APP, AlertChannel.EMAIL],
        recipients: data.recipients ?? [],
        enabled: data.enabled ?? true,
      },
    });
  }

  async getAlertTrigger(triggerId: string) {
    return this.prisma.alertTrigger.findUnique({
      where: { id: triggerId },
    });
  }

  async listAlertTriggers(type?: AlertType) {
    return this.prisma.alertTrigger.findMany({
      where: type ? { type, enabled: true } : { enabled: true },
    });
  }

  async getDomainRenewalAlerts() {
    const trigger = await this.prisma.alertTrigger.findFirst({
      where: {
        type: AlertType.DOMAIN_RENEWAL,
        enabled: true,
      },
    });

    if (!trigger) {
      return [];
    }

    return this.domainsService.listDomainsExpiringIn(trigger.daysBeforeExpiry);
  }

  async getSSLRenewalAlerts() {
    const trigger = await this.prisma.alertTrigger.findFirst({
      where: {
        type: AlertType.DOMAIN_RENEWAL,
        enabled: true,
      },
    });

    if (!trigger) {
      return [];
    }

    return this.domainsService.listSSLExpiringIn(trigger.daysBeforeExpiry);
  }

  async getSubscriptionRenewalAlerts() {
    const trigger = await this.prisma.alertTrigger.findFirst({
      where: {
        type: AlertType.SUBSCRIPTION_RENEWAL,
        enabled: true,
      },
    });

    if (!trigger) {
      return [];
    }

    return this.subscriptionsService.listSubscriptionsRenewingIn(trigger.daysBeforeExpiry);
  }

  async getProjectBehindScheduleAlerts() {
    return this.prisma.projectCompletion.findMany({
      where: {
        AND: [
          { status: { in: ['AT_RISK', 'BLOCKED'] } },
        ],
      },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { lastAssessedAt: 'desc' },
    });
  }

  async getInvoiceOverdueAlerts() {
    return this.prisma.invoice.findMany({
      where: {
        status: 'OVERDUE',
      },
      include: {
        client: true,
        project: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async updateAlertTrigger(
    triggerId: string,
    data: Partial<CreateAlertTriggerDTO>,
  ) {
    return this.prisma.alertTrigger.update({
      where: { id: triggerId },
      data,
    });
  }

  async deleteAlertTrigger(triggerId: string) {
    return this.prisma.alertTrigger.delete({
      where: { id: triggerId },
    });
  }

  async markDomainAlertSent(domainId: string) {
    return this.prisma.domainManagement.update({
      where: { id: domainId },
      data: {
        renewalAlertSentAt: new Date(),
      },
    });
  }

  async markSubscriptionAlertSent(subscriptionId: string) {
    return this.prisma.projectSubscription.update({
      where: { id: subscriptionId },
      data: {
        alertSentAt: new Date(),
      },
    });
  }

  async getAlertsSummary() {
    const [
      domainAlerts,
      sslAlerts,
      subscriptionAlerts,
      projectAlerts,
      invoiceAlerts,
    ] = await Promise.all([
      this.getDomainRenewalAlerts(),
      this.getSSLRenewalAlerts(),
      this.getSubscriptionRenewalAlerts(),
      this.getProjectBehindScheduleAlerts(),
      this.getInvoiceOverdueAlerts(),
    ]);

    return {
      domainRenewals: domainAlerts,
      sslRenewals: sslAlerts,
      subscriptionRenewals: subscriptionAlerts,
      projectsAtRisk: projectAlerts,
      overdueInvoices: invoiceAlerts,
      totalAlerts:
        domainAlerts.length +
        sslAlerts.length +
        subscriptionAlerts.length +
        projectAlerts.length +
        invoiceAlerts.length,
    };
  }

  async getAlertsForProject(projectId: string) {
    const [domains, subscriptions, completion] = await Promise.all([
      this.domainsService.listDomainsByProject(projectId),
      this.subscriptionsService.listSubscriptionsByProject(projectId),
      this.prisma.projectCompletion.findUnique({
        where: { projectId },
      }),
    ]);

    const alerts: any[] = [];

    // Domain alerts
    const domainTrigger = await this.prisma.alertTrigger.findFirst({
      where: { type: AlertType.DOMAIN_RENEWAL, enabled: true },
    });

    if (domainTrigger) {
      domains.forEach((domain) => {
        if (domain.expirationDate) {
          const daysUntilExpiry = Math.floor(
            (domain.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          );

          if (daysUntilExpiry <= domainTrigger.daysBeforeExpiry && daysUntilExpiry >= 0) {
            const severity = daysUntilExpiry < 7 ? 'CRITICAL' : daysUntilExpiry < 30 ? 'WARNING' : 'INFO';
            alerts.push({
              type: 'DOMAIN_RENEWAL',
              severity,
              title: `Domain expires in ${daysUntilExpiry} days`,
              description: `${domain.domainName} expires on ${domain.expirationDate.toDateString()}`,
              data: domain,
            });
          }
        }
      });
    }

    // Subscription alerts
    const subscriptionTrigger = await this.prisma.alertTrigger.findFirst({
      where: { type: AlertType.SUBSCRIPTION_RENEWAL, enabled: true },
    });

    if (subscriptionTrigger) {
      subscriptions.forEach((sub) => {
        if (sub.renewalDate) {
          const daysUntilRenewal = Math.floor(
            (sub.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          );

          if (daysUntilRenewal <= subscriptionTrigger.daysBeforeExpiry && daysUntilRenewal >= 0) {
            const severity = daysUntilRenewal < 7 ? 'WARNING' : 'INFO';
            alerts.push({
              type: 'SUBSCRIPTION_RENEWAL',
              severity,
              title: `${sub.serviceName} renews in ${daysUntilRenewal} days`,
              description: `Cost: $${sub.monthlyCost}/${sub.billingFrequency.toLowerCase()}`,
              data: sub,
            });
          }
        }
      });
    }

    // Project health alerts
    if (completion && ['AT_RISK', 'BLOCKED'].includes(completion.status)) {
      alerts.push({
        type: 'PROJECT_BEHIND_SCHEDULE',
        severity: completion.status === 'BLOCKED' ? 'CRITICAL' : 'WARNING',
        title: `Project is ${completion.status.toLowerCase()}`,
        description: completion.riskFactors.join(', '),
        data: completion,
      });
    }

    return alerts;
  }
}
