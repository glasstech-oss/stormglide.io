import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface CreateSubscriptionDTO {
  projectId: string;
  serviceName: string;
  monthlyCost: number;
  billingFrequency?: 'MONTHLY' | 'ANNUAL' | 'ONE_TIME';
  renewalDate?: Date;
  autoRenew?: boolean;
  notes?: string;
}

@Injectable()
export class ProjectSubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(data: CreateSubscriptionDTO) {
    return this.prisma.projectSubscription.create({
      data: {
        projectId: data.projectId,
        serviceName: data.serviceName,
        monthlyCost: new Prisma.Decimal(data.monthlyCost),
        billingFrequency: data.billingFrequency ?? 'MONTHLY',
        renewalDate: data.renewalDate,
        autoRenew: data.autoRenew ?? true,
        notes: data.notes,
      },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async getSubscription(subscriptionId: string) {
    return this.prisma.projectSubscription.findUnique({
      where: { id: subscriptionId },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async listSubscriptionsByProject(projectId: string) {
    return this.prisma.projectSubscription.findMany({
      where: { projectId },
      orderBy: { renewalDate: 'asc' },
    });
  }

  async listSubscriptionsRenewingIn(daysThreshold: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return this.prisma.projectSubscription.findMany({
      where: {
        AND: [
          {
            renewalDate: {
              lte: thresholdDate,
              gte: new Date(),
            },
          },
        ],
      },
      include: {
        project: { include: { client: true } },
      },
      orderBy: { renewalDate: 'asc' },
    });
  }

  async getTotalMonthlyCost(projectId: string) {
    const result = await this.prisma.projectSubscription.aggregate({
      where: {
        projectId,
        billingFrequency: 'MONTHLY',
      },
      _sum: {
        monthlyCost: true,
      },
    });

    return result._sum.monthlyCost || new Prisma.Decimal(0);
  }

  async updateSubscription(
    subscriptionId: string,
    data: Partial<CreateSubscriptionDTO>,
  ) {
    return this.prisma.projectSubscription.update({
      where: { id: subscriptionId },
      data: {
        serviceName: data.serviceName,
        monthlyCost: data.monthlyCost ? new Prisma.Decimal(data.monthlyCost) : undefined,
        billingFrequency: data.billingFrequency,
        renewalDate: data.renewalDate,
        autoRenew: data.autoRenew,
        notes: data.notes,
      },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async markSubscriptionRenewed(subscriptionId: string) {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    const newRenewalDate = new Date(subscription.renewalDate!);

    if (subscription.billingFrequency === 'ANNUAL') {
      newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
    } else if (subscription.billingFrequency === 'MONTHLY') {
      newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
    } else {
      // ONE_TIME - don't renew
      return subscription;
    }

    return this.prisma.projectSubscription.update({
      where: { id: subscriptionId },
      data: {
        renewalDate: newRenewalDate,
        alertSentAt: null,
      },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async deleteSubscription(subscriptionId: string) {
    return this.prisma.projectSubscription.delete({
      where: { id: subscriptionId },
    });
  }
}
