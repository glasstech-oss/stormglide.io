import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CrmModule } from './crm/crm.module';
import { BillingModule } from './billing/billing.module';
import { LabModule } from './lab/lab.module';
import { EventsModule } from './events/events.module';
import { SettingsModule } from './settings/settings.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        CrmModule,
        BillingModule,
        LabModule,
        EventsModule,
        SettingsModule,
    ],
})
export class AppModule { }
