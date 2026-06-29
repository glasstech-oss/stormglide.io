import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { DomainsService, CreateDomainDTO } from './domains.service';

@Controller('v1/domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @Post()
  create(@Body() data: CreateDomainDTO) {
    return this.domainsService.createDomain(data);
  }

  @Get()
  list(@Query('projectId') projectId?: string) {
    if (projectId) {
      return this.domainsService.listDomainsByProject(projectId);
    }
    return { message: 'Use projectId query parameter' };
  }

  @Get('expiring')
  getExpiring(@Query('days') days: number = 30) {
    return this.domainsService.listDomainsExpiringIn(parseInt(days as any));
  }

  @Get('ssl/expiring')
  getSSLExpiring(@Query('days') days: number = 30) {
    return this.domainsService.listSSLExpiringIn(parseInt(days as any));
  }

  @Get(':id')
  getDomain(@Param('id') domainId: string) {
    return this.domainsService.getDomain(domainId);
  }

  @Put(':id')
  update(@Param('id') domainId: string, @Body() data: Partial<CreateDomainDTO>) {
    return this.domainsService.updateDomain(domainId, data);
  }

  @Put(':id/renew')
  renewDomain(@Param('id') domainId: string) {
    return this.domainsService.markDomainRenewed(domainId);
  }

  @Put(':id/ssl/renew')
  renewSSL(@Param('id') domainId: string) {
    return this.domainsService.markSSLRenewed(domainId);
  }

  @Delete(':id')
  delete(@Param('id') domainId: string) {
    return this.domainsService.deleteDomain(domainId);
  }
}
