import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { LabService } from './lab.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('v1/lab')
export class LabController {
    constructor(private readonly labService: LabService) { }

    @Post('blueprint')
    @Roles(Role.OMEGA)
    @HttpCode(HttpStatus.CREATED)
    async createBlueprint(
        @Body() body: { authorId: string; title: string; rawPrompt: string }
    ) {
        return await this.labService.generateBlueprint(body.authorId, body.title, body.rawPrompt);
    }

    @Get('blueprints/:authorId')
    @HttpCode(HttpStatus.OK)
    async getBlueprints(@Param('authorId') authorId: string) {
        return await this.labService.getAllBlueprints(authorId);
    }
}
