import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PortalService } from './portal.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@Controller('v1/portal')
@UseGuards(JwtAuthGuard)
export class PortalController {
    constructor(private readonly portalService: PortalService) { }

    @Get('me')
    async getMyData(@AuthUser() user: { id: string; email: string; role: string }) {
        return this.portalService.getClientPortalData(user.id);
    }

    @Post('feedback/:projectId')
    async submitFeedback(
        @AuthUser() user: { id: string },
        @Param('projectId') projectId: string,
        @Body() body: { componentIdentifier: string; comment: string; screenX?: number; screenY?: number }
    ) {
        return this.portalService.submitFeedback(user.id, projectId, body);
    }
}
