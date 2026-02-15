import { Injectable, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

export interface MagicLinkPayload {
    email: string;
    token: string;
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * STEP 1: Generate a secure Magic Link for a Client or Admin
     */
    async requestMagicLink(email: string): Promise<{ message: string; previewUrl?: string }> {
        try {
            // 1. Find the user or create a temporary client record if they are new
            let user = await this.prisma.user.findUnique({ where: { email } });

            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        email,
                        role: 'CLIENT', // Default to restricted client access
                    },
                });
                this.logger.log(`Created new client profile for email: ${email}`);
            }

            // 2. Generate a highly secure, cryptographically random token
            const rawToken = randomBytes(32).toString('hex');

            // 3. Hash the token payload for JWT (Expires in 15 minutes)
            const jwtToken = this.jwtService.sign(
                { email: user.email, sub: user.id },
                { expiresIn: '15m' }
            );

            // 4. Save the token and expiry securely in the database
            const tokenExpiry = new Date();
            tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 15);

            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    magicLinkToken: jwtToken,
                    tokenExpiry,
                },
            });

            // 5. Build the Magic Link URL (In production, this routes to your Next.js front-end)
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const magicLinkUrl = `${frontendUrl}/auth/verify?token=${jwtToken}`;

            // TODO: Integrate actual email service (SendGrid/AWS SES/Postmark) here.
            // For now, we simulate the email dispatch.
            this.logger.log(`[SIMULATED EMAIL DISPATCH] Magic Link sent to ${email}. URL: ${magicLinkUrl}`);

            return {
                message: 'If an account matches that email, a secure login link has been sent.',
                previewUrl: process.env.NODE_ENV === 'development' ? magicLinkUrl : undefined,
            };

        } catch (error) {
            this.logger.error(`Failed to generate magic link for ${email}`, error.stack);
            throw new InternalServerErrorException('Authentication engine error');
        }
    }

    /**
     * STEP 2: Verify the Magic Link and grant a long-term Session Token
     */
    async verifyMagicLink(token: string): Promise<{ accessToken: string }> {
        try {
            // 1. Verify the JWT signature
            const payload = this.jwtService.verify(token);

            // 2. Check the database to ensure the token hasn't been used or revoked
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });

            if (!user || user.magicLinkToken !== token) {
                throw new UnauthorizedException('Invalid, expired, or previously used magic link.');
            }

            if (user.tokenExpiry && new Date() > user.tokenExpiry) {
                throw new UnauthorizedException('This magic link has expired.');
            }

            // 3. Token is valid. Generate a long-term Session Access Token (Expires in 7 days)
            const sessionToken = this.jwtService.sign(
                { email: user.email, sub: user.id, role: user.role },
                { expiresIn: '7d' }
            );

            // 4. Invalidate the single-use magic link & update last login
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    magicLinkToken: null,
                    tokenExpiry: null,
                    lastLoginAt: new Date(),
                },
            });

            this.logger.log(`User ${user.email} successfully authenticated via Magic Link.`);

            return { accessToken: sessionToken };

        } catch (error) {
            this.logger.error('Magic link verification failed.', error.stack);
            throw new UnauthorizedException('Authentication failed. Please request a new link.');
        }
    }
}
