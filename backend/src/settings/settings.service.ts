import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService implements OnModuleInit {
    private readonly logger = new Logger(SettingsService.name);

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        await this.ensureSingleton();
    }

    private async ensureSingleton() {
        const settings = await this.prisma.siteSettings.findUnique({
            where: { id: 'singleton' },
        });

        if (!settings) {
            this.logger.log('Initializing Global Site Settings singleton...');
            await this.prisma.siteSettings.create({
                data: { id: 'singleton' },
            });
        }
    }

    async getSettings() {
        return this.prisma.siteSettings.findUnique({
            where: { id: 'singleton' },
        });
    }

    async updateSettings(data: any) {
        this.logger.log('Updating Global Site Settings...');
        return this.prisma.siteSettings.update({
            where: { id: 'singleton' },
            data,
        });
    }
}
