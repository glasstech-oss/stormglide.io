import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface CreateDomainDTO {
  projectId: string;
  domainName: string;
  registrar?: string;
  expirationDate?: Date;
  sslCertProvider?: string;
  sslExpirationDate?: Date;
  autoRenew?: boolean;
  cost?: number;
}

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  async createDomain(data: CreateDomainDTO) {
    const nextRenewalDate = data.expirationDate
      ? new Date(data.expirationDate)
      : undefined;

    return this.prisma.domainManagement.create({
      data: {
        projectId: data.projectId,
        domainName: data.domainName,
        registrar: data.registrar,
        expirationDate: data.expirationDate,
        sslCertProvider: data.sslCertProvider,
        sslExpirationDate: data.sslExpirationDate,
        autoRenew: data.autoRenew ?? true,
        cost: data.cost ? new Prisma.Decimal(data.cost) : undefined,
        nextRenewalDate,
        status: 'ACTIVE',
      },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async getDomain(domainId: string) {
    return this.prisma.domainManagement.findUnique({
      where: { id: domainId },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async listDomainsByProject(projectId: string) {
    return this.prisma.domainManagement.findMany({
      where: { projectId },
      orderBy: { expirationDate: 'asc' },
    });
  }

  async listDomainsExpiringIn(daysThreshold: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return this.prisma.domainManagement.findMany({
      where: {
        AND: [
          {
            expirationDate: {
              lte: thresholdDate,
              gte: new Date(),
            },
          },
          {
            status: { not: 'EXPIRED' },
          },
        ],
      },
      include: {
        project: { include: { client: true } },
      },
      orderBy: { expirationDate: 'asc' },
    });
  }

  async listSSLExpiringIn(daysThreshold: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return this.prisma.domainManagement.findMany({
      where: {
        AND: [
          {
            sslExpirationDate: {
              lte: thresholdDate,
              gte: new Date(),
            },
          },
        ],
      },
      include: {
        project: { include: { client: true } },
      },
      orderBy: { sslExpirationDate: 'asc' },
    });
  }

  async updateDomain(domainId: string, data: Partial<CreateDomainDTO>) {
    return this.prisma.domainManagement.update({
      where: { id: domainId },
      data: {
        domainName: data.domainName,
        registrar: data.registrar,
        expirationDate: data.expirationDate,
        sslCertProvider: data.sslCertProvider,
        sslExpirationDate: data.sslExpirationDate,
        autoRenew: data.autoRenew,
        cost: data.cost ? new Prisma.Decimal(data.cost) : undefined,
      },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async markDomainRenewed(domainId: string) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');

    const newExpirationDate = new Date(domain.expirationDate!);
    newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);

    return this.prisma.domainManagement.update({
      where: { id: domainId },
      data: {
        expirationDate: newExpirationDate,
        nextRenewalDate: newExpirationDate,
        status: 'ACTIVE',
        renewalAlertSentAt: null,
      },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async markSSLRenewed(domainId: string) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');

    const newSSLExpiration = new Date(domain.sslExpirationDate!);
    newSSLExpiration.setFullYear(newSSLExpiration.getFullYear() + 1);

    return this.prisma.domainManagement.update({
      where: { id: domainId },
      data: {
        sslExpirationDate: newSSLExpiration,
        renewalAlertSentAt: null,
      },
      include: {
        project: { include: { client: true } },
      },
    });
  }

  async deleteDomain(domainId: string) {
    return this.prisma.domainManagement.delete({
      where: { id: domainId },
    });
  }
}
