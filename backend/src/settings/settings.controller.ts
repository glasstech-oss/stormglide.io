import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) { }

    @Get()
    async getSettings() {
        return this.settingsService.getSettings();
    }

    @Put()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.OMEGA)
    async updateSettings(@Body() data: any) {
        return this.settingsService.updateSettings(data);
    }
}
