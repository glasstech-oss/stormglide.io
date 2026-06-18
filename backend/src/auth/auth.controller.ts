import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('request-magic-link')
    @HttpCode(HttpStatus.OK)
    async requestLink(@Body('email') email: string) {
        if (!email || !email.includes('@')) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'A valid email address is required.',
            };
        }
        return await this.authService.requestMagicLink(email.toLowerCase());
    }

    @Get('verify')
    @HttpCode(HttpStatus.OK)
    async verifyLink(@Query('token') token: string) {
        if (!token) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Authentication token is missing from the request.',
            };
        }
        return await this.authService.verifyMagicLink(token);
    }

    @Post('admin-login')
    @HttpCode(HttpStatus.OK)
    async adminLogin(@Body('accessKey') accessKey: string) {
        if (!accessKey) {
            throw new UnauthorizedException('Authorization key is required.');
        }
        return await this.authService.validateAdminKey(accessKey);
    }
}
