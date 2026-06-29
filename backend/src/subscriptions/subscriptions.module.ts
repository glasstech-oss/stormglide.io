import { Module } from '@nestjs/common';
import { ProjectSubscriptionsService } from './project-subscriptions.service';
import { ProjectSubscriptionsController } from './project-subscriptions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjectSubscriptionsService],
  controllers: [ProjectSubscriptionsController],
  exports: [ProjectSubscriptionsService],
})
export class SubscriptionsModule {}
