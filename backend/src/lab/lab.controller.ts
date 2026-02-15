import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { LabService } from './lab.service';

// In production, uncomment the line below to enforce Super Admin access only
// @UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('v1/lab')
export class LabController {
    constructor(private readonly labService: LabService) { }

    @Post('blueprint')
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
