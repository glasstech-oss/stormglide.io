import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CrmModule } from './crm/crm.module';
import { BillingModule } from './billing/billing.module';
import { LabModule } from './lab/lab.module';
import { EventsModule } from './events/events.module';
import { SettingsModule } from './settings/settings.module';
import { KanbanModule } from './kanban/kanban.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { PortalModule } from './portal/portal.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ProjectsModule } from './projects/projects.module';
import { DomainsModule } from './domains/domains.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AlertsModule } from './alerts/alerts.module';
import { MilestonesModule } from './milestones/milestones.module';
import { TeamModule } from './team/team.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        NotificationsModule,
        AuthModule,
        CrmModule,
        BillingModule,
        LabModule,
        EventsModule,
        SettingsModule,
        KanbanModule,
        MonitoringModule,
        PortalModule,
        AuditModule,
        SchedulerModule,
        ProjectsModule,
        DomainsModule,
        SubscriptionsModule,
        AlertsModule,
        MilestonesModule,
        TeamModule,
    ],
})
export class AppModule { }
