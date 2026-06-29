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
import { AlertsService, CreateAlertTriggerDTO } from './alerts.service';
import { AlertType } from '@prisma/client';

@Controller('v1/alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Post('triggers')
  createTrigger(@Body() data: CreateAlertTriggerDTO) {
    return this.alertsService.createAlertTrigger(data);
  }

  @Get('triggers')
  listTriggers(@Query('type') type?: AlertType) {
    return this.alertsService.listAlertTriggers(type);
  }

  @Get('triggers/:id')
  getTrigger(@Param('id') triggerId: string) {
    return this.alertsService.getAlertTrigger(triggerId);
  }

  @Put('triggers/:id')
  updateTrigger(
    @Param('id') triggerId: string,
    @Body() data: Partial<CreateAlertTriggerDTO>,
  ) {
    return this.alertsService.updateAlertTrigger(triggerId, data);
  }

  @Delete('triggers/:id')
  deleteTrigger(@Param('id') triggerId: string) {
    return this.alertsService.deleteAlertTrigger(triggerId);
  }

  @Get('domain-renewal')
  getDomainAlerts() {
    return this.alertsService.getDomainRenewalAlerts();
  }

  @Get('ssl-renewal')
  getSSLAlerts() {
    return this.alertsService.getSSLRenewalAlerts();
  }

  @Get('subscription-renewal')
  getSubscriptionAlerts() {
    return this.alertsService.getSubscriptionRenewalAlerts();
  }

  @Get('project-behind')
  getProjectBehindAlerts() {
    return this.alertsService.getProjectBehindScheduleAlerts();
  }

  @Get('invoice-overdue')
  getInvoiceAlerts() {
    return this.alertsService.getInvoiceOverdueAlerts();
  }

  @Get('summary')
  getSummary() {
    return this.alertsService.getAlertsSummary();
  }

  @Get('project/:projectId')
  getAlertsForProject(@Param('projectId') projectId: string) {
    return this.alertsService.getAlertsForProject(projectId);
  }

  @Put('domain/:domainId/mark-sent')
  markDomainAlertSent(@Param('domainId') domainId: string) {
    return this.alertsService.markDomainAlertSent(domainId);
  }

  @Put('subscription/:subscriptionId/mark-sent')
  markSubscriptionAlertSent(@Param('subscriptionId') subscriptionId: string) {
    return this.alertsService.markSubscriptionAlertSent(subscriptionId);
  }
}
