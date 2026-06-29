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
import {
  ProjectSubscriptionsService,
  CreateSubscriptionDTO,
} from './project-subscriptions.service';

@Controller('v1/project-subscriptions')
export class ProjectSubscriptionsController {
  constructor(private subscriptionsService: ProjectSubscriptionsService) {}

  @Post()
  create(@Body() data: CreateSubscriptionDTO) {
    return this.subscriptionsService.createSubscription(data);
  }

  @Get()
  list(@Query('projectId') projectId?: string) {
    if (projectId) {
      return this.subscriptionsService.listSubscriptionsByProject(projectId);
    }
    return { message: 'Use projectId query parameter' };
  }

  @Get('renewing')
  getRenewing(@Query('days') days: number = 7) {
    return this.subscriptionsService.listSubscriptionsRenewingIn(parseInt(days as any));
  }

  @Get(':id')
  getSubscription(@Param('id') subscriptionId: string) {
    return this.subscriptionsService.getSubscription(subscriptionId);
  }

  @Get(':projectId/total-cost')
  getTotalCost(@Param('projectId') projectId: string) {
    return this.subscriptionsService.getTotalMonthlyCost(projectId);
  }

  @Put(':id')
  update(
    @Param('id') subscriptionId: string,
    @Body() data: Partial<CreateSubscriptionDTO>,
  ) {
    return this.subscriptionsService.updateSubscription(subscriptionId, data);
  }

  @Put(':id/renew')
  renewSubscription(@Param('id') subscriptionId: string) {
    return this.subscriptionsService.markSubscriptionRenewed(subscriptionId);
  }

  @Delete(':id')
  delete(@Param('id') subscriptionId: string) {
    return this.subscriptionsService.deleteSubscription(subscriptionId);
  }
}
