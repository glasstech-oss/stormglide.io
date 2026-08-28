/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
const crm_module_1 = __webpack_require__(15);
const billing_module_1 = __webpack_require__(20);
const lab_module_1 = __webpack_require__(23);
const events_module_1 = __webpack_require__(27);
const settings_module_1 = __webpack_require__(31);
const kanban_module_1 = __webpack_require__(34);
const monitoring_module_1 = __webpack_require__(37);
const portal_module_1 = __webpack_require__(40);
const audit_module_1 = __webpack_require__(44);
const notifications_module_1 = __webpack_require__(47);
const scheduler_module_1 = __webpack_require__(48);
const projects_module_1 = __webpack_require__(54);
const domains_module_1 = __webpack_require__(57);
const subscriptions_module_1 = __webpack_require__(60);
const alerts_module_1 = __webpack_require__(63);
const milestones_module_1 = __webpack_require__(66);
const team_module_1 = __webpack_require__(69);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            notifications_module_1.NotificationsModule,
            auth_module_1.AuthModule,
            crm_module_1.CrmModule,
            billing_module_1.BillingModule,
            lab_module_1.LabModule,
            events_module_1.EventsModule,
            settings_module_1.SettingsModule,
            kanban_module_1.KanbanModule,
            monitoring_module_1.MonitoringModule,
            portal_module_1.PortalModule,
            audit_module_1.AuditModule,
            scheduler_module_1.SchedulerModule,
            projects_module_1.ProjectsModule,
            domains_module_1.DomainsModule,
            subscriptions_module_1.SubscriptionsModule,
            alerts_module_1.AlertsModule,
            milestones_module_1.MilestonesModule,
            team_module_1.TeamModule,
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(7);
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
            ],
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully established connection to the Stormglide PostgreSQL Core.');
        }
        catch (error) {
            this.logger.error('Failed to connect to the database', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database connection cleanly terminated.');
    }
    async isHealthy() {
        try {
            await this.$queryRaw `SELECT 1`;
            return true;
        }
        catch (e) {
            return false;
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
const auth_service_1 = __webpack_require__(10);
const auth_controller_1 = __webpack_require__(13);
const prisma_module_1 = __webpack_require__(5);
const config_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(14);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_auth_guard_1.JwtAuthGuard],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, jwt_auth_guard_1.JwtAuthGuard],
    })
], AuthModule);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
const prisma_service_1 = __webpack_require__(6);
const notifications_service_1 = __webpack_require__(11);
const crypto_1 = __webpack_require__(12);
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, notifications) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notifications = notifications;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async requestMagicLink(email) {
        try {
            let user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        email,
                        role: 'CLIENT',
                    },
                });
                this.logger.log(`Created new client profile for email: ${email}`);
            }
            const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
            const jwtToken = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '15m' });
            const tokenExpiry = new Date();
            tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 15);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    magicLinkToken: jwtToken,
                    tokenExpiry,
                },
            });
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const magicLinkUrl = `${frontendUrl}/auth/verify?token=${jwtToken}`;
            await this.notifications.sendMagicLink(email, magicLinkUrl);
            this.logger.log(`Magic link dispatched to ${email}`);
            return {
                message: 'If an account matches that email, a secure login link has been sent.',
                previewUrl: process.env.NODE_ENV === 'development' ? magicLinkUrl : undefined,
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate magic link for ${email}`, error.stack);
            throw new common_1.InternalServerErrorException('Authentication engine error');
        }
    }
    async verifyMagicLink(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || user.magicLinkToken !== token) {
                throw new common_1.UnauthorizedException('Invalid, expired, or previously used magic link.');
            }
            if (user.tokenExpiry && new Date() > user.tokenExpiry) {
                throw new common_1.UnauthorizedException('This magic link has expired.');
            }
            const sessionToken = this.jwtService.sign({ email: user.email, sub: user.id, role: user.role }, { expiresIn: '7d' });
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
        }
        catch (error) {
            this.logger.error('Magic link verification failed.', error.stack);
            throw new common_1.UnauthorizedException('Authentication failed. Please request a new link.');
        }
    }
    async validateAdminKey(key) {
        const expectedKey = process.env.ADMIN_ACCESS_KEY || 'stormglide-2026';
        if (key !== expectedKey) {
            throw new common_1.UnauthorizedException('Invalid Commander Authorization Key.');
        }
        const sessionToken = this.jwtService.sign({
            email: 'commander@stormglide.io',
            sub: 'omega-prime',
            role: 'OMEGA'
        }, { expiresIn: '24h' });
        this.logger.log('New Mission Control session established via Commander Key.');
        return { accessToken: sessionToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(2);
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor() {
        this.logger = new common_1.Logger(NotificationsService_1.name);
        this.resendApiKey = process.env.RESEND_API_KEY;
        this.fromEmail = process.env.FROM_EMAIL || 'noreply@stormglide.io';
        this.adminEmail = process.env.ADMIN_EMAIL || 'admin@stormglide.io';
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    }
    async sendEmail(to, subject, html) {
        if (!this.resendApiKey) {
            this.logger.warn(`[EMAIL SKIPPED — no RESEND_API_KEY] To: ${to} | Subject: ${subject}`);
            return;
        }
        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ from: this.fromEmail, to, subject, html }),
            });
            if (!res.ok) {
                const err = await res.text();
                this.logger.error(`Resend error: ${err}`);
            }
            else {
                this.logger.log(`Email sent to ${to}: ${subject}`);
            }
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${to}`, err);
        }
    }
    async sendMagicLink(email, magicLinkUrl) {
        const html = `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;overflow:hidden">
                <div style="background:linear-gradient(135deg,#22D3EE,#A855F7);padding:2px">
                    <div style="background:#0d1117;padding:40px 32px">
                        <h1 style="font-size:24px;font-weight:700;margin:0 0 8px">Your Portal Access Link</h1>
                        <p style="color:#9ca3af;margin:0 0 32px">Click the button below to securely access your project portal. This link expires in 15 minutes.</p>
                        <a href="${magicLinkUrl}" style="display:inline-block;background:#22D3EE;color:#04181f;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
                            Access My Portal →
                        </a>
                        <p style="color:#6b7280;font-size:12px;margin-top:24px">If you didn't request this link, you can safely ignore this email.</p>
                        <p style="color:#374151;font-size:11px;font-family:monospace;margin-top:32px;word-break:break-all">${magicLinkUrl}</p>
                    </div>
                </div>
            </div>
        `;
        await this.sendEmail(email, 'Your Stormglide Portal Access Link', html);
    }
    async sendAlertNotification(alert) {
        const severityColor = alert.severity === 'critical' ? '#ef4444' : alert.severity === 'high' ? '#f97316' : '#f59e0b';
        const html = `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
                    <div style="width:12px;height:12px;border-radius:50%;background:${severityColor}"></div>
                    <span style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#9ca3af;letter-spacing:2px">${alert.severity} Alert</span>
                </div>
                <h2 style="font-size:20px;font-weight:700;margin:0 0 12px">${alert.title}</h2>
                <p style="color:#9ca3af;margin:0 0 8px">${alert.description}</p>
                ${alert.clientName ? `<p style="color:#6b7280;font-size:13px">Client: <strong style="color:#e5e7eb">${alert.clientName}</strong></p>` : ''}
                <a href="${this.frontendUrl}/admin/dashboard" style="display:inline-block;margin-top:24px;background:#22D3EE;color:#04181f;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px">
                    Open Alert Center →
                </a>
                <p style="color:#374151;font-size:11px;font-family:monospace;margin-top:24px">STORMGLIDE MISSION CONTROL</p>
            </div>
        `;
        await this.sendEmail(this.adminEmail, `[${alert.severity.toUpperCase()}] ${alert.title}`, html);
    }
    async sendInvoiceNotification(to, invoice) {
        const html = `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
                <h2 style="font-size:20px;font-weight:700;margin:0 0 24px">Invoice ${invoice.invoiceNumber}</h2>
                <div style="background:#111827;border-radius:12px;padding:20px;margin-bottom:24px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="color:#9ca3af">Amount Due</span>
                        <strong style="font-size:20px">${invoice.currency} ${invoice.amount.toLocaleString()}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between">
                        <span style="color:#9ca3af">Due Date</span>
                        <span>${invoice.dueDate}</span>
                    </div>
                </div>
                ${invoice.paymentLink ? `
                    <a href="${invoice.paymentLink}" style="display:inline-block;background:#22D3EE;color:#04181f;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
                        Pay Now →
                    </a>
                ` : ''}
                <p style="color:#6b7280;font-size:12px;margin-top:24px">Questions? Reply to this email or reach us on WhatsApp.</p>
            </div>
        `;
        await this.sendEmail(to, `Invoice ${invoice.invoiceNumber} — ${invoice.currency} ${invoice.amount.toLocaleString()}`, html);
    }
    async sendPhaseAdvanceNotification(to, data) {
        const phaseLabels = {
            UI_UX_DESIGN: 'UI/UX Design', BACKEND_ARCHITECTURE: 'Backend Architecture',
            STAGING: 'Live Staging', PRODUCTION: 'Production Launch', MAINTENANCE: 'Maintenance',
        };
        const html = `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
                <div style="margin-bottom:24px">
                    <span style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#22D3EE;letter-spacing:2px">Project Update</span>
                </div>
                <h2 style="font-size:20px;font-weight:700;margin:0 0 12px">Your project has advanced to ${phaseLabels[data.newPhase] || data.newPhase}</h2>
                <p style="color:#9ca3af;margin:0 0 8px">${data.projectName} is now entering a new milestone phase.</p>
                <a href="${data.portalUrl}" style="display:inline-block;margin-top:24px;background:#22D3EE;color:#04181f;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px">
                    View Progress →
                </a>
            </div>
        `;
        await this.sendEmail(to, `Project Update: ${data.projectName} → ${phaseLabels[data.newPhase] || data.newPhase}`, html);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(10);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async requestLink(email) {
        if (!email || !email.includes('@')) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'A valid email address is required.',
            };
        }
        return await this.authService.requestMagicLink(email.toLowerCase());
    }
    async verifyLink(token) {
        if (!token) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Authentication token is missing from the request.',
            };
        }
        return await this.authService.verifyMagicLink(token);
    }
    async adminLogin(accessKey) {
        if (!accessKey) {
            throw new common_1.UnauthorizedException('Authorization key is required.');
        }
        return await this.authService.validateAdminKey(accessKey);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('request-magic-link'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestLink", null);
__decorate([
    (0, common_1.Get)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLink", null);
__decorate([
    (0, common_1.Post)('admin-login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('accessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('v1/auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No authentication token provided.');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
            });
            request['user'] = payload;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token.');
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], JwtAuthGuard);


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrmModule = void 0;
const common_1 = __webpack_require__(2);
const crm_service_1 = __webpack_require__(16);
const crm_controller_1 = __webpack_require__(17);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let CrmModule = class CrmModule {
};
exports.CrmModule = CrmModule;
exports.CrmModule = CrmModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [crm_service_1.CrmService],
        controllers: [crm_controller_1.CrmController],
        exports: [crm_service_1.CrmService],
    })
], CrmModule);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CrmService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrmService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(10);
const notifications_service_1 = __webpack_require__(11);
const client_1 = __webpack_require__(7);
let CrmService = CrmService_1 = class CrmService {
    constructor(prisma, authService, notifications) {
        this.prisma = prisma;
        this.authService = authService;
        this.notifications = notifications;
        this.logger = new common_1.Logger(CrmService_1.name);
    }
    async getAllClients(search) {
        const where = search
            ? {
                OR: [
                    { companyName: { contains: search, mode: 'insensitive' } },
                    { contactName: { contains: search, mode: 'insensitive' } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                ],
            }
            : {};
        return this.prisma.clientProfile.findMany({
            where,
            include: {
                user: { select: { id: true, email: true, role: true, lastLoginAt: true } },
                projects: {
                    select: {
                        id: true, projectName: true, currentPhase: true,
                        stagingUrl: true, productionUrl: true, startDate: true, estimatedEnd: true,
                    },
                },
                invoices: { select: { id: true, invoiceNumber: true, amount: true, currency: true, status: true, dueDate: true, paidAt: true } },
                subscriptions: { select: { id: true, serviceName: true, monthlyRate: true, currency: true, status: true, nextBillingDate: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getClientById(clientId) {
        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            include: {
                user: { select: { id: true, email: true, role: true, lastLoginAt: true, createdAt: true } },
                projects: {
                    include: {
                        milestones: { orderBy: { phase: 'asc' } },
                        feedback: { where: { status: 'OPEN' }, orderBy: { createdAt: 'desc' }, take: 5 },
                    },
                    orderBy: { startDate: 'desc' },
                },
                invoices: { orderBy: { issuedAt: 'desc' } },
                subscriptions: { orderBy: { nextBillingDate: 'asc' } },
                documents: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found.');
        return client;
    }
    async getAllProjects() {
        return this.prisma.project.findMany({
            include: {
                client: { select: { id: true, companyName: true, contactName: true, whatsappNumber: true } },
                milestones: { orderBy: { phase: 'asc' } },
                feedback: { where: { status: 'OPEN' }, select: { id: true, comment: true, status: true, createdAt: true } },
            },
            orderBy: { startDate: 'desc' },
        });
    }
    async getProjectById(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                client: true,
                milestones: { orderBy: { phase: 'asc' } },
                feedback: { orderBy: { createdAt: 'desc' } },
                invoices: { orderBy: { issuedAt: 'desc' } },
                kanbanTasks: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found.');
        return project;
    }
    async getAllLeads(status) {
        return this.prisma.lead.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateLeadStatus(leadId, status) {
        return this.prisma.lead.update({
            where: { id: leadId },
            data: { status },
        });
    }
    async getDashboardStats() {
        const [clientCount, projectCount, openFeedback, leadCount] = await Promise.all([
            this.prisma.clientProfile.count(),
            this.prisma.project.count(),
            this.prisma.stagingFeedback.count({ where: { status: 'OPEN' } }),
            this.prisma.lead.count({ where: { status: 'NEW' } }),
        ]);
        const activeProjects = await this.prisma.project.groupBy({
            by: ['currentPhase'],
            _count: { id: true },
        });
        return { clientCount, projectCount, openFeedback, leadCount, activeProjects };
    }
    async createClientProfile(userId, data) {
        try {
            const profile = await this.prisma.clientProfile.create({
                data: {
                    userId,
                    companyName: data.companyName,
                    contactName: data.contactName,
                    whatsappNumber: data.whatsappNumber,
                    industry: data.industry,
                    region: data.region || 'GLOBAL',
                },
            });
            this.logger.log(`Client Profile created for company: ${data.companyName}`);
            return profile;
        }
        catch (error) {
            this.logger.error('Failed to create client profile', error.stack);
            throw new common_1.BadRequestException('Could not create client profile. Ensure User ID exists.');
        }
    }
    async initializeProject(clientId, data) {
        const client = await this.prisma.clientProfile.findUnique({ where: { id: clientId } });
        if (!client)
            throw new common_1.NotFoundException('Client profile not found.');
        const project = await this.prisma.project.create({
            data: {
                clientId,
                projectName: data.projectName,
                description: data.description,
                currentPhase: client_1.ProjectPhase.DISCOVERY,
                estimatedEnd: data.estimatedEnd,
            },
        });
        await this.prisma.projectMilestone.createMany({
            data: [
                { projectId: project.id, phase: client_1.ProjectPhase.DISCOVERY, title: 'Deep Discovery & Requirements Gathering', description: 'Conduct stakeholder interviews, define user personas, map business processes, and finalize the full technical requirements document.' },
                { projectId: project.id, phase: client_1.ProjectPhase.UI_UX_DESIGN, title: 'UI/UX Interactive Prototyping', description: 'Design high-fidelity wireframes and interactive prototypes in Figma. Present for client review and approval before any code is written.' },
                { projectId: project.id, phase: client_1.ProjectPhase.BACKEND_ARCHITECTURE, title: 'Database Schema & API Architecture', description: 'Architect the Prisma schema, design RESTful or GraphQL APIs, set up cloud infrastructure (AWS/GCP/DigitalOcean), and configure CI/CD pipelines.' },
                { projectId: project.id, phase: client_1.ProjectPhase.STAGING, title: 'Live Staging Sandbox Deployment', description: 'Deploy to staging environment, conduct QA, and open the live sandbox for client feedback using the visual annotation tool.' },
                { projectId: project.id, phase: client_1.ProjectPhase.PRODUCTION, title: 'Production Launch & Handover', description: 'Final performance optimization, security audit, DNS cutover, and full handover documentation for ongoing maintenance.' },
            ],
        });
        this.logger.log(`Project initialized. Job ID: ${project.id} assigned to ${client.companyName}`);
        return project;
    }
    async advanceProjectPhase(projectId, newPhase) {
        const project = await this.prisma.project.update({
            where: { id: projectId },
            data: { currentPhase: newPhase },
            include: { client: { include: { user: { select: { email: true } } } } },
        });
        await this.prisma.projectMilestone.updateMany({
            where: { projectId, phase: newPhase },
            data: { isCompleted: true, completedAt: new Date() },
        });
        this.logger.log(`Project ${project.projectName} advanced to ${newPhase}.`);
        const clientEmail = project.client.user?.email;
        if (clientEmail) {
            const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal`;
            await this.notifications.sendPhaseAdvanceNotification(clientEmail, {
                clientName: project.client.companyName,
                projectName: project.projectName,
                newPhase: newPhase.replace(/_/g, ' '),
                portalUrl,
            }).catch(err => this.logger.warn(`Phase notification failed: ${err.message}`));
        }
        return project;
    }
    async sendPortalAccess(clientId) {
        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            include: { user: { select: { email: true } } },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found.');
        if (!client.user?.email)
            throw new common_1.BadRequestException('Client has no linked user account with an email address.');
        await this.authService.requestMagicLink(client.user.email);
        this.logger.log(`Portal access link dispatched to ${client.user.email} for ${client.companyName}`);
        return { message: `Portal access link sent to ${client.user.email}` };
    }
    async logStagingFeedback(projectId, clientId, data) {
        const feedback = await this.prisma.stagingFeedback.create({
            data: {
                projectId,
                clientId,
                componentIdentifier: data.componentIdentifier,
                comment: data.comment,
                screenX: data.screenX,
                screenY: data.screenY,
            },
        });
        this.logger.log(`New Staging Feedback received for Project ID: ${projectId}`);
        return feedback;
    }
    async createLead(data) {
        try {
            const lead = await this.prisma.lead.create({
                data: {
                    name: data.name,
                    email: data.email,
                    organization: data.organization,
                    missionScope: data.missionScope,
                    details: data.details,
                },
            });
            this.logger.log(`New Lead registered: ${data.name} (${data.organization || 'Individual'})`);
            return lead;
        }
        catch (error) {
            this.logger.error('Failed to register lead', error.stack);
            throw new common_1.BadRequestException('Could not process mission briefing.');
        }
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = CrmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object, typeof (_c = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _c : Object])
], CrmService);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrmController = void 0;
const common_1 = __webpack_require__(2);
const crm_service_1 = __webpack_require__(16);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
let CrmController = class CrmController {
    constructor(crmService) {
        this.crmService = crmService;
    }
    async getClients(search) {
        return this.crmService.getAllClients(search);
    }
    async getClient(id) {
        return this.crmService.getClientById(id);
    }
    async getProjects() {
        return this.crmService.getAllProjects();
    }
    async getProject(id) {
        return this.crmService.getProjectById(id);
    }
    async getLeads(status) {
        return this.crmService.getAllLeads(status);
    }
    async getDashboardStats() {
        return this.crmService.getDashboardStats();
    }
    async createLead(body) {
        return this.crmService.createLead(body);
    }
    async createClient(body) {
        return this.crmService.createClientProfile(body.userId, body);
    }
    async createProject(clientId, body) {
        return this.crmService.initializeProject(clientId, body);
    }
    async updatePhase(projectId, body) {
        return this.crmService.advanceProjectPhase(projectId, body.newPhase);
    }
    async updateLeadStatus(leadId, body) {
        return this.crmService.updateLeadStatus(leadId, body.status);
    }
    async submitFeedback(projectId, body) {
        return this.crmService.logStagingFeedback(projectId, body.clientId, body);
    }
    async sendPortalAccess(id) {
        return this.crmService.sendPortalAccess(id);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.Get)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getClients", null);
__decorate([
    (0, common_1.Get)('clients/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getClient", null);
__decorate([
    (0, common_1.Get)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)('project/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getProject", null);
__decorate([
    (0, common_1.Get)('leads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Post)('lead'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createLead", null);
__decorate([
    (0, common_1.Post)('client'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createClient", null);
__decorate([
    (0, common_1.Post)('project/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createProject", null);
__decorate([
    (0, common_1.Put)('project/:projectId/phase'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updatePhase", null);
__decorate([
    (0, common_1.Put)('lead/:leadId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('leadId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateLeadStatus", null);
__decorate([
    (0, common_1.Post)('project/:projectId/feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA, client_1.Role.CLIENT),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "submitFeedback", null);
__decorate([
    (0, common_1.Post)('clients/:id/portal-access'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "sendPortalAccess", null);
exports.CrmController = CrmController = __decorate([
    (0, common_1.Controller)('v1/crm'),
    __metadata("design:paramtypes", [typeof (_a = typeof crm_service_1.CrmService !== "undefined" && crm_service_1.CrmService) === "function" ? _a : Object])
], CrmController);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const roles_decorator_1 = __webpack_require__(19);
const client_1 = __webpack_require__(7);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.ForbiddenException('Authentication protocol not initialized.');
        }
        const userRole = user.role;
        const hasPermission = requiredRoles.includes(userRole) ||
            (requiredRoles.includes(client_1.Role.ADMIN) && userRole === client_1.Role.OMEGA);
        if (!hasPermission) {
            throw new common_1.ForbiddenException('Insufficient permissions to access this protocol.');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(2);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingModule = void 0;
const common_1 = __webpack_require__(2);
const billing_service_1 = __webpack_require__(21);
const billing_controller_1 = __webpack_require__(22);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [billing_service_1.BillingService],
        controllers: [billing_controller_1.BillingController],
        exports: [billing_service_1.BillingService],
    })
], BillingModule);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BillingService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const notifications_service_1 = __webpack_require__(11);
const client_1 = __webpack_require__(7);
let BillingService = BillingService_1 = class BillingService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(BillingService_1.name);
    }
    async createPaystackPaymentLink(invoice, clientEmail) {
        const paystackKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackKey) {
            this.logger.warn('PAYSTACK_SECRET_KEY not set — skipping payment link generation');
            return null;
        }
        try {
            const res = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${paystackKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: clientEmail,
                    amount: Math.round(Number(invoice.amount) * 100),
                    currency: invoice.currency,
                    reference: invoice.invoiceNumber,
                    metadata: { invoice_id: invoice.id, invoice_number: invoice.invoiceNumber },
                    callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal`,
                }),
            });
            const data = await res.json();
            if (data.status && data.data?.authorization_url) {
                return data.data.authorization_url;
            }
            this.logger.warn(`Paystack init failed: ${JSON.stringify(data)}`);
            return null;
        }
        catch (err) {
            this.logger.error('Paystack error', err);
            return null;
        }
    }
    async createStripePaymentLink(invoice, clientEmail) {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            this.logger.warn('STRIPE_SECRET_KEY not set — skipping Stripe payment link');
            return null;
        }
        try {
            const params = new URLSearchParams({
                'payment_method_types[]': 'card',
                'line_items[0][price_data][currency]': invoice.currency.toLowerCase(),
                'line_items[0][price_data][unit_amount]': String(Math.round(Number(invoice.amount) * 100)),
                'line_items[0][price_data][product_data][name]': `Invoice ${invoice.invoiceNumber}`,
                'line_items[0][quantity]': '1',
                mode: 'payment',
                client_reference_id: invoice.id,
                customer_email: clientEmail,
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal?paid=1`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal`,
            });
            const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${stripeKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });
            const data = await res.json();
            return data.url || null;
        }
        catch (err) {
            this.logger.error('Stripe error', err);
            return null;
        }
    }
    async getAllInvoices(status, clientId) {
        return this.prisma.invoice.findMany({
            where: {
                ...(status && { status: status }),
                ...(clientId && { clientId }),
            },
            include: {
                client: { select: { id: true, companyName: true, contactName: true } },
                project: { select: { id: true, projectName: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async getInvoicesByClient(clientId) {
        return this.prisma.invoice.findMany({
            where: { clientId },
            include: {
                project: { select: { id: true, projectName: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async getAllSubscriptions(clientId) {
        return this.prisma.subscription.findMany({
            where: clientId ? { clientId } : {},
            include: {
                client: { select: { id: true, companyName: true } },
            },
            orderBy: { nextBillingDate: 'asc' },
        });
    }
    async getBillingStats() {
        const [totalInvoiced, paidInvoices, overdueCount, activeSubscriptions] = await Promise.all([
            this.prisma.invoice.aggregate({ _sum: { amount: true } }),
            this.prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
            this.prisma.invoice.count({ where: { status: 'OVERDUE' } }),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        ]);
        const monthlyRecurring = await this.prisma.subscription.aggregate({
            _sum: { monthlyRate: true },
            where: { status: 'ACTIVE' },
        });
        return {
            totalInvoiced: totalInvoiced._sum.amount || 0,
            totalPaid: paidInvoices._sum.amount || 0,
            overdueCount,
            activeSubscriptions,
            monthlyRecurring: monthlyRecurring._sum.monthlyRate || 0,
        };
    }
    async generateInvoice(clientId, data) {
        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            include: { user: { select: { email: true } } },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found for invoicing.');
        let selectedGateway = client_1.PaymentGateway.STRIPE;
        const normalizedCurrency = data.currency.toUpperCase();
        if (['GHS', 'NGN', 'ZAR'].includes(normalizedCurrency)) {
            selectedGateway = client_1.PaymentGateway.PAYSTACK;
        }
        const uniqueHash = Math.random().toString(36).substring(2, 6).toUpperCase();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${uniqueHash}`;
        try {
            const invoice = await this.prisma.invoice.create({
                data: {
                    invoiceNumber,
                    clientId,
                    projectId: data.projectId,
                    amount: data.amount,
                    currency: normalizedCurrency,
                    paymentGateway: selectedGateway,
                    dueDate: new Date(data.dueDate),
                    status: client_1.InvoiceStatus.DRAFT,
                },
            });
            this.logger.log(`Generated ${normalizedCurrency} Invoice ${invoiceNumber} routed via ${selectedGateway}`);
            let paymentLink = null;
            const clientEmail = client.user?.email || '';
            if (selectedGateway === client_1.PaymentGateway.PAYSTACK) {
                paymentLink = await this.createPaystackPaymentLink(invoice, clientEmail);
            }
            else {
                paymentLink = await this.createStripePaymentLink(invoice, clientEmail);
            }
            if (paymentLink) {
                await this.prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { pdfUrl: paymentLink, status: client_1.InvoiceStatus.SENT },
                });
            }
            if (clientEmail) {
                await this.notifications.sendInvoiceNotification(clientEmail, {
                    invoiceNumber,
                    amount: data.amount,
                    currency: normalizedCurrency,
                    dueDate: new Date(data.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    paymentLink: paymentLink || undefined,
                });
            }
            return { ...invoice, paymentLink };
        }
        catch (error) {
            this.logger.error('Failed to generate invoice', error.stack);
            throw new common_1.InternalServerErrorException('Billing engine failure during invoice generation.');
        }
    }
    async updateInvoiceStatus(invoiceId, status) {
        return this.prisma.invoice.update({
            where: { id: invoiceId },
            data: { status, ...(status === 'PAID' ? { paidAt: new Date() } : {}) },
        });
    }
    async processPaystackWebhook(payload) {
        if (payload.event === 'charge.success') {
            const transactionId = payload.data.reference;
            const invoiceId = payload.data.metadata.invoice_id;
            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: client_1.InvoiceStatus.PAID, paidAt: new Date(), transactionId },
            });
            this.logger.log(`Paystack Payment Success. Invoice ${invoiceId} marked as PAID.`);
        }
        return { received: true };
    }
    async processStripeWebhook(payload) {
        if (payload.type === 'checkout.session.completed') {
            const session = payload.data.object;
            const invoiceId = session.client_reference_id;
            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: client_1.InvoiceStatus.PAID, paidAt: new Date(), transactionId: session.payment_intent },
            });
            this.logger.log(`Stripe Payment Success. Invoice ${invoiceId} marked as PAID.`);
        }
        return { received: true };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _b : Object])
], BillingService);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingController = void 0;
const common_1 = __webpack_require__(2);
const billing_service_1 = __webpack_require__(21);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
let BillingController = class BillingController {
    constructor(billingService) {
        this.billingService = billingService;
    }
    async getInvoices(status, clientId) {
        return this.billingService.getAllInvoices(status, clientId);
    }
    async getClientInvoices(clientId) {
        return this.billingService.getInvoicesByClient(clientId);
    }
    async getSubscriptions(clientId) {
        return this.billingService.getAllSubscriptions(clientId);
    }
    async getBillingStats() {
        return this.billingService.getBillingStats();
    }
    async createInvoice(clientId, body) {
        return this.billingService.generateInvoice(clientId, body);
    }
    async updateInvoiceStatus(invoiceId, body) {
        return this.billingService.updateInvoiceStatus(invoiceId, body.status);
    }
    async handlePaystackWebhook(body, signature) {
        return this.billingService.processPaystackWebhook(body);
    }
    async handleStripeWebhook(body, signature) {
        return this.billingService.processStripeWebhook(body);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Get)('invoices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA, client_1.Role.CLIENT),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getClientInvoices", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getSubscriptions", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getBillingStats", null);
__decorate([
    (0, common_1.Post)('invoice/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Put)('invoice/:invoiceId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __param(0, (0, common_1.Param)('invoiceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updateInvoiceStatus", null);
__decorate([
    (0, common_1.Post)('webhook/paystack'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "handlePaystackWebhook", null);
__decorate([
    (0, common_1.Post)('webhook/stripe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "handleStripeWebhook", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('v1/billing'),
    __metadata("design:paramtypes", [typeof (_a = typeof billing_service_1.BillingService !== "undefined" && billing_service_1.BillingService) === "function" ? _a : Object])
], BillingController);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabModule = void 0;
const common_1 = __webpack_require__(2);
const lab_service_1 = __webpack_require__(24);
const lab_controller_1 = __webpack_require__(26);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let LabModule = class LabModule {
};
exports.LabModule = LabModule;
exports.LabModule = LabModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [lab_service_1.LabService],
        controllers: [lab_controller_1.LabController],
        exports: [lab_service_1.LabService],
    })
], LabModule);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LabService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const generative_ai_1 = __webpack_require__(25);
let LabService = LabService_1 = class LabService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(LabService_1.name);
        const apiKey = process.env.GEMINI_API_KEY || 'YOUR_FALLBACK_API_KEY';
        this.aiClient = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async generateBlueprint(authorId, title, rawPrompt) {
        const author = await this.prisma.user.findUnique({ where: { id: authorId } });
        if (!author)
            throw new common_1.NotFoundException('Author not found.');
        this.logger.log(`Initiating AI Blueprint Generation for: ${title}`);
        const systemInstruction = `
      You are an elite, world-class Systems Architect. 
      Analyze the following client request and design a robust PostgreSQL database schema using Prisma ORM.
      
      You MUST respond with a raw JSON object and nothing else. Do not include markdown formatting like \`\`\`json.
      
      The JSON structure MUST exactly match this format:
      {
        "proposedTechStack": ["List", "of", "technologies"],
        "architectureSummary": "A brief paragraph explaining the system design.",
        "prismaSchema": "// The raw string containing the Prisma schema models",
        "estimatedComplexity": "Low" | "Medium" | "High" | "Enterprise"
      }
    `;
        try {
            const model = this.aiClient.getGenerativeModel({ model: 'gemini-1.5-pro' });
            const result = await model.generateContent(`${systemInstruction}\n\nCLIENT REQUEST:\n${rawPrompt}`);
            const responseText = result.response.text();
            const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const aiOutputParsed = JSON.parse(cleanedJsonString);
            const labNote = await this.prisma.labNote.create({
                data: {
                    authorId,
                    title,
                    markdownContent: rawPrompt,
                    aiSchemaOutput: aiOutputParsed,
                    tags: ['ai-blueprint', 'architecture'],
                },
            });
            this.logger.log(`Blueprint successfully generated and saved. Note ID: ${labNote.id}`);
            return labNote;
        }
        catch (error) {
            this.logger.error('Failed to generate AI Blueprint', error.stack);
            throw new common_1.InternalServerErrorException('The AI engine failed to process the architecture blueprint.');
        }
    }
    async getAllBlueprints(authorId) {
        return await this.prisma.labNote.findMany({
            where: { authorId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.LabService = LabService;
exports.LabService = LabService = LabService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], LabService);


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabController = void 0;
const common_1 = __webpack_require__(2);
const lab_service_1 = __webpack_require__(24);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
let LabController = class LabController {
    constructor(labService) {
        this.labService = labService;
    }
    async createBlueprint(body) {
        return await this.labService.generateBlueprint(body.authorId, body.title, body.rawPrompt);
    }
    async getBlueprints(authorId) {
        return await this.labService.getAllBlueprints(authorId);
    }
};
exports.LabController = LabController;
__decorate([
    (0, common_1.Post)('blueprint'),
    (0, roles_decorator_1.Roles)(client_1.Role.OMEGA),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "createBlueprint", null);
__decorate([
    (0, common_1.Get)('blueprints/:authorId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('authorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getBlueprints", null);
exports.LabController = LabController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('v1/lab'),
    __metadata("design:paramtypes", [typeof (_a = typeof lab_service_1.LabService !== "undefined" && lab_service_1.LabService) === "function" ? _a : Object])
], LabController);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsModule = void 0;
const common_1 = __webpack_require__(2);
const events_gateway_1 = __webpack_require__(28);
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        providers: [events_gateway_1.EventsGateway],
        exports: [events_gateway_1.EventsGateway],
    })
], EventsModule);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EventsGateway_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsGateway = void 0;
const websockets_1 = __webpack_require__(29);
const socket_io_1 = __webpack_require__(30);
const common_1 = __webpack_require__(2);
let EventsGateway = EventsGateway_1 = class EventsGateway {
    constructor() {
        this.logger = new common_1.Logger(EventsGateway_1.name);
        this.activeConnections = 0;
    }
    handleConnection(client) {
        this.activeConnections++;
        this.logger.log(`Client connected: ${client.id}. Total active: ${this.activeConnections}`);
        this.server.emit('system_pulse', {
            status: 'SYSTEMS NOMINAL',
            activeUsers: this.activeConnections,
            deployments: 14
        });
    }
    handleDisconnect(client) {
        this.activeConnections--;
        this.logger.log(`Client disconnected: ${client.id}`);
        this.server.emit('system_pulse', {
            status: 'SYSTEMS NOMINAL',
            activeUsers: this.activeConnections,
        });
    }
    handleStagingFeedback(data, client) {
        this.logger.log(`Live feedback received for Project ${data.projectId}: ${data.comment}`);
        this.server.emit('admin_notification', {
            type: 'NEW_FEEDBACK',
            message: `New feedback on project ${data.projectId}`,
            timestamp: new Date(),
        });
        return { status: 'Received by Command Center' };
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('submit_staging_feedback'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleStagingFeedback", null);
exports.EventsGateway = EventsGateway = EventsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    })
], EventsGateway);


/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsModule = void 0;
const common_1 = __webpack_require__(2);
const settings_service_1 = __webpack_require__(32);
const settings_controller_1 = __webpack_require__(33);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [settings_service_1.SettingsService],
        controllers: [settings_controller_1.SettingsController],
        exports: [settings_service_1.SettingsService],
    })
], SettingsModule);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SettingsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let SettingsService = SettingsService_1 = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SettingsService_1.name);
    }
    async onModuleInit() {
        await this.ensureSingleton();
    }
    async ensureSingleton() {
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
    async updateSettings(data) {
        this.logger.log('Updating Global Site Settings...');
        return this.prisma.siteSettings.update({
            where: { id: 'singleton' },
            data,
        });
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SettingsService);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsController = void 0;
const common_1 = __webpack_require__(2);
const settings_service_1 = __webpack_require__(32);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getSettings() {
        return this.settingsService.getSettings();
    }
    async updateSettings(data) {
        return this.settingsService.updateSettings(data);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.OMEGA),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateSettings", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('v1/settings'),
    __metadata("design:paramtypes", [typeof (_a = typeof settings_service_1.SettingsService !== "undefined" && settings_service_1.SettingsService) === "function" ? _a : Object])
], SettingsController);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KanbanModule = void 0;
const common_1 = __webpack_require__(2);
const kanban_controller_1 = __webpack_require__(35);
const kanban_service_1 = __webpack_require__(36);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let KanbanModule = class KanbanModule {
};
exports.KanbanModule = KanbanModule;
exports.KanbanModule = KanbanModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [kanban_controller_1.KanbanController],
        providers: [kanban_service_1.KanbanService],
        exports: [kanban_service_1.KanbanService],
    })
], KanbanModule);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KanbanController = void 0;
const common_1 = __webpack_require__(2);
const kanban_service_1 = __webpack_require__(36);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
let KanbanController = class KanbanController {
    constructor(kanbanService) {
        this.kanbanService = kanbanService;
    }
    async getTasks(projectId, status) {
        return this.kanbanService.getAllTasks(projectId, status);
    }
    async getBoard(projectId) {
        return this.kanbanService.getKanbanBoard(projectId);
    }
    async getTask(id) {
        return this.kanbanService.getTaskById(id);
    }
    async createTask(body) {
        return this.kanbanService.createTask(body);
    }
    async updateTask(id, body) {
        return this.kanbanService.updateTask(id, body);
    }
    async deleteTask(id) {
        return this.kanbanService.deleteTask(id);
    }
};
exports.KanbanController = KanbanController;
__decorate([
    (0, common_1.Get)('tasks'),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KanbanController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Get)('board'),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KanbanController.prototype, "getBoard", null);
__decorate([
    (0, common_1.Get)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KanbanController.prototype, "getTask", null);
__decorate([
    (0, common_1.Post)('tasks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KanbanController.prototype, "createTask", null);
__decorate([
    (0, common_1.Put)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KanbanController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KanbanController.prototype, "deleteTask", null);
exports.KanbanController = KanbanController = __decorate([
    (0, common_1.Controller)('v1/kanban'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __metadata("design:paramtypes", [typeof (_a = typeof kanban_service_1.KanbanService !== "undefined" && kanban_service_1.KanbanService) === "function" ? _a : Object])
], KanbanController);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KanbanService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let KanbanService = class KanbanService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllTasks(projectId, status) {
        return this.prisma.kanbanTask.findMany({
            where: {
                ...(projectId && { projectId }),
                ...(status && { status }),
            },
            include: {
                project: { select: { id: true, projectName: true, client: { select: { companyName: true } } } },
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async getTaskById(taskId) {
        const task = await this.prisma.kanbanTask.findUnique({
            where: { id: taskId },
            include: { project: { include: { client: true } } },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found.');
        return task;
    }
    async createTask(data) {
        return this.prisma.kanbanTask.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status || 'BACKLOG',
                priority: data.priority || 'MEDIUM',
                projectId: data.projectId,
                assigneeId: data.assigneeId,
            },
        });
    }
    async updateTask(taskId, data) {
        await this.getTaskById(taskId);
        return this.prisma.kanbanTask.update({
            where: { id: taskId },
            data,
        });
    }
    async deleteTask(taskId) {
        await this.getTaskById(taskId);
        return this.prisma.kanbanTask.delete({ where: { id: taskId } });
    }
    async getKanbanBoard(projectId) {
        const tasks = await this.getAllTasks(projectId);
        const columns = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DEPLOYED'];
        return columns.reduce((board, col) => {
            board[col] = tasks.filter(t => t.status === col);
            return board;
        }, {});
    }
};
exports.KanbanService = KanbanService;
exports.KanbanService = KanbanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], KanbanService);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitoringModule = void 0;
const common_1 = __webpack_require__(2);
const monitoring_controller_1 = __webpack_require__(38);
const monitoring_service_1 = __webpack_require__(39);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let MonitoringModule = class MonitoringModule {
};
exports.MonitoringModule = MonitoringModule;
exports.MonitoringModule = MonitoringModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [monitoring_controller_1.MonitoringController],
        providers: [monitoring_service_1.MonitoringService],
        exports: [monitoring_service_1.MonitoringService],
    })
], MonitoringModule);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitoringController = void 0;
const common_1 = __webpack_require__(2);
const monitoring_service_1 = __webpack_require__(39);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
let MonitoringController = class MonitoringController {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    async getSnapshots(clientId) {
        return this.monitoringService.getInfraSnapshots(clientId);
    }
    async getInfraSummary() {
        return this.monitoringService.getLatestSnapshotPerClient();
    }
    async recordSnapshot(body) {
        return this.monitoringService.recordSnapshot(body);
    }
    async getAlerts(resolvedStr) {
        const resolved = resolvedStr === 'true' ? true : resolvedStr === 'false' ? false : undefined;
        return this.monitoringService.getAllAlerts(resolved);
    }
    async getAlertStats() {
        return this.monitoringService.getAlertStats();
    }
    async createAlert(body) {
        return this.monitoringService.createAlert(body);
    }
    async resolveAlert(id, body) {
        return this.monitoringService.resolveAlert(id, body.resolvedBy);
    }
    async reopenAlert(id) {
        return this.monitoringService.reopenAlert(id);
    }
    async getDocuments(clientId, type) {
        return this.monitoringService.getDocuments(clientId, type);
    }
    async createDocument(body) {
        return this.monitoringService.createDocument(body);
    }
    async updateDocumentStatus(id, body) {
        return this.monitoringService.updateDocumentStatus(id, body.status);
    }
};
exports.MonitoringController = MonitoringController;
__decorate([
    (0, common_1.Get)('infra'),
    __param(0, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getSnapshots", null);
__decorate([
    (0, common_1.Get)('infra/summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getInfraSummary", null);
__decorate([
    (0, common_1.Post)('infra/snapshot'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "recordSnapshot", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Query)('resolved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getAlertStats", null);
__decorate([
    (0, common_1.Post)('alerts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Put)('alerts/:id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Put)('alerts/:id/reopen'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "reopenAlert", null);
__decorate([
    (0, common_1.Get)('documents'),
    __param(0, (0, common_1.Query)('clientId')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)('documents'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "createDocument", null);
__decorate([
    (0, common_1.Put)('documents/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "updateDocumentStatus", null);
exports.MonitoringController = MonitoringController = __decorate([
    (0, common_1.Controller)('v1/monitoring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __metadata("design:paramtypes", [typeof (_a = typeof monitoring_service_1.MonitoringService !== "undefined" && monitoring_service_1.MonitoringService) === "function" ? _a : Object])
], MonitoringController);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MonitoringService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitoringService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let MonitoringService = MonitoringService_1 = class MonitoringService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MonitoringService_1.name);
    }
    async getInfraSnapshots(clientId) {
        return this.prisma.infraSnapshot.findMany({
            where: clientId ? { clientId } : {},
            include: {
                client: { select: { id: true, companyName: true } },
                project: { select: { id: true, projectName: true } },
            },
            orderBy: { checkedAt: 'desc' },
        });
    }
    async getLatestSnapshotPerClient() {
        const clients = await this.prisma.clientProfile.findMany({
            select: { id: true, companyName: true, contactName: true },
        });
        const snapshots = await Promise.all(clients.map(async (client) => {
            const latest = await this.prisma.infraSnapshot.findMany({
                where: { clientId: client.id },
                orderBy: { checkedAt: 'desc' },
                take: 20,
            });
            return { client, snapshots: latest };
        }));
        return snapshots;
    }
    async getAllAlerts(resolved) {
        return this.prisma.alertRecord.findMany({
            where: resolved !== undefined ? { resolved } : {},
            include: {
                client: { select: { id: true, companyName: true } },
            },
            orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async resolveAlert(alertId, resolvedBy) {
        return this.prisma.alertRecord.update({
            where: { id: alertId },
            data: { resolved: true, resolvedAt: new Date(), resolvedBy },
        });
    }
    async reopenAlert(alertId) {
        return this.prisma.alertRecord.update({
            where: { id: alertId },
            data: { resolved: false, resolvedAt: null, resolvedBy: null },
        });
    }
    async createAlert(data) {
        return this.prisma.alertRecord.create({ data });
    }
    async recordSnapshot(data) {
        const snapshot = await this.prisma.infraSnapshot.create({ data: { ...data, details: data.details } });
        if (data.status === 'CRITICAL' || data.status === 'WARNING') {
            const client = await this.prisma.clientProfile.findUnique({ where: { id: data.clientId }, select: { companyName: true } });
            await this.prisma.alertRecord.create({
                data: {
                    type: data.checkType,
                    severity: data.status === 'CRITICAL' ? 'critical' : 'high',
                    title: `${data.checkType} ${data.status} — ${data.target}`,
                    description: `Automated monitoring detected a ${data.status.toLowerCase()} condition for ${data.target}`,
                    clientId: data.clientId,
                    clientName: client?.companyName,
                },
            });
            this.logger.warn(`Alert created: ${data.checkType} ${data.status} for ${data.target}`);
        }
        return snapshot;
    }
    async getAlertStats() {
        const [critical, high, medium, low, unresolved] = await Promise.all([
            this.prisma.alertRecord.count({ where: { severity: 'critical', resolved: false } }),
            this.prisma.alertRecord.count({ where: { severity: 'high', resolved: false } }),
            this.prisma.alertRecord.count({ where: { severity: 'medium', resolved: false } }),
            this.prisma.alertRecord.count({ where: { severity: 'low', resolved: false } }),
            this.prisma.alertRecord.count({ where: { resolved: false } }),
        ]);
        return { critical, high, medium, low, unresolved };
    }
    async getDocuments(clientId, type) {
        return this.prisma.document.findMany({
            where: {
                ...(clientId && { clientId }),
                ...(type && { type }),
            },
            include: {
                client: { select: { id: true, companyName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createDocument(data) {
        return this.prisma.document.create({ data });
    }
    async updateDocumentStatus(docId, status) {
        return this.prisma.document.update({ where: { id: docId }, data: { status } });
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = MonitoringService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MonitoringService);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortalModule = void 0;
const common_1 = __webpack_require__(2);
const portal_controller_1 = __webpack_require__(41);
const portal_service_1 = __webpack_require__(42);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let PortalModule = class PortalModule {
};
exports.PortalModule = PortalModule;
exports.PortalModule = PortalModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [portal_controller_1.PortalController],
        providers: [portal_service_1.PortalService],
    })
], PortalModule);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortalController = void 0;
const common_1 = __webpack_require__(2);
const portal_service_1 = __webpack_require__(42);
const jwt_auth_guard_1 = __webpack_require__(14);
const auth_user_decorator_1 = __webpack_require__(43);
let PortalController = class PortalController {
    constructor(portalService) {
        this.portalService = portalService;
    }
    async getMyData(user) {
        return this.portalService.getClientPortalData(user.id);
    }
    async submitFeedback(user, projectId, body) {
        return this.portalService.submitFeedback(user.id, projectId, body);
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "getMyData", null);
__decorate([
    (0, common_1.Post)('feedback/:projectId'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "submitFeedback", null);
exports.PortalController = PortalController = __decorate([
    (0, common_1.Controller)('v1/portal'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof portal_service_1.PortalService !== "undefined" && portal_service_1.PortalService) === "function" ? _a : Object])
], PortalController);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortalService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let PortalService = class PortalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getClientPortalData(userId) {
        const profile = await this.prisma.clientProfile.findUnique({
            where: { userId },
            include: {
                user: { select: { id: true, email: true, lastLoginAt: true } },
                projects: {
                    include: {
                        milestones: { orderBy: { phase: 'asc' } },
                        feedback: {
                            where: { status: 'OPEN' },
                            orderBy: { createdAt: 'desc' },
                            take: 10,
                        },
                    },
                    orderBy: { startDate: 'desc' },
                },
                invoices: {
                    orderBy: { issuedAt: 'desc' },
                    take: 10,
                },
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    orderBy: { nextBillingDate: 'asc' },
                },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Client profile not found. Please contact your account manager.');
        }
        const projects = profile.projects.map(project => {
            const PHASE_ORDER = ['DISCOVERY', 'UI_UX_DESIGN', 'BACKEND_ARCHITECTURE', 'STAGING', 'PRODUCTION', 'MAINTENANCE'];
            const currentIndex = PHASE_ORDER.indexOf(project.currentPhase);
            const progress = Math.round(((currentIndex + 1) / PHASE_ORDER.length) * 100);
            const completedMilestones = project.milestones.filter(m => m.isCompleted).length;
            return {
                ...project,
                progress,
                completedMilestones,
                totalMilestones: project.milestones.length,
            };
        });
        return {
            profile: {
                id: profile.id,
                companyName: profile.companyName,
                contactName: profile.contactName,
                industry: profile.industry,
                region: profile.region,
            },
            user: profile.user,
            projects,
            invoices: profile.invoices,
            subscriptions: profile.subscriptions,
        };
    }
    async submitFeedback(userId, projectId, data) {
        const profile = await this.prisma.clientProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.UnauthorizedException('Client profile not found.');
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, clientId: profile.id },
        });
        if (!project)
            throw new common_1.UnauthorizedException('You do not have access to this project.');
        return this.prisma.stagingFeedback.create({
            data: {
                projectId,
                clientId: profile.id,
                componentIdentifier: data.componentIdentifier,
                comment: data.comment,
                screenX: data.screenX,
                screenY: data.screenY,
            },
        });
    }
};
exports.PortalService = PortalService;
exports.PortalService = PortalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PortalService);


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthUser = void 0;
const common_1 = __webpack_require__(2);
exports.AuthUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditModule = void 0;
const common_1 = __webpack_require__(2);
const audit_controller_1 = __webpack_require__(45);
const audit_service_1 = __webpack_require__(46);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let AuditModule = class AuditModule {
};
exports.AuditModule = AuditModule;
exports.AuditModule = AuditModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [audit_controller_1.AuditController],
        providers: [audit_service_1.AuditService],
        exports: [audit_service_1.AuditService],
    })
], AuditModule);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditController = void 0;
const common_1 = __webpack_require__(2);
const audit_service_1 = __webpack_require__(46);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(14);
const roles_guard_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async getLogs(page, limit, entityType) {
        return this.auditService.getLogs(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50, entityType);
    }
    async createLog(body) {
        return this.auditService.createLog(body);
    }
    async getProjectHistory(limit) {
        return this.auditService.getProjectHistory(limit ? parseInt(limit) : 50);
    }
    async getEntityHistory(limit) {
        return this.auditService.getEntityHistory(limit ? parseInt(limit) : 50);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)('logs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "createLog", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getProjectHistory", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getEntityHistory", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.Controller)('v1/audit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OMEGA),
    __metadata("design:paramtypes", [typeof (_a = typeof audit_service_1.AuditService !== "undefined" && audit_service_1.AuditService) === "function" ? _a : Object])
], AuditController);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logAction(data) {
        return this.prisma.auditLog.create({
            data: {
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                adminId: data.adminId,
                ipAddress: data.ipAddress,
                timestamp: new Date(),
            },
        });
    }
    async getLogs(page = 1, limit = 50, entityType) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where: entityType ? { entityType } : {},
                include: {
                    admin: { select: { id: true, email: true, role: true } },
                },
                orderBy: { timestamp: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where: entityType ? { entityType } : {} }),
        ]);
        return { logs, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async getProjectHistory(projectId, limit = 50) {
        return this.prisma.auditLog.findMany({
            where: {
                entityId: projectId,
            },
            include: {
                admin: { select: { id: true, email: true } },
            },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
    async getEntityHistory(entityType, entityId, limit = 50) {
        return this.prisma.auditLog.findMany({
            where: {
                entityType,
                entityId,
            },
            include: {
                admin: { select: { id: true, email: true } },
            },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
    async createLog(data) {
        return this.prisma.auditLog.create({ data });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AuditService);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(2);
const notifications_service_1 = __webpack_require__(11);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [notifications_service_1.NotificationsService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchedulerModule = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(49);
const scheduler_service_1 = __webpack_require__(50);
const prisma_module_1 = __webpack_require__(5);
const notifications_module_1 = __webpack_require__(47);
let SchedulerModule = class SchedulerModule {
};
exports.SchedulerModule = SchedulerModule;
exports.SchedulerModule = SchedulerModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        providers: [scheduler_service_1.SchedulerService],
        exports: [scheduler_service_1.SchedulerService],
    })
], SchedulerModule);


/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchedulerService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchedulerService = void 0;
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(49);
const prisma_service_1 = __webpack_require__(6);
const notifications_service_1 = __webpack_require__(11);
const tls = __webpack_require__(51);
const https = __webpack_require__(52);
const http = __webpack_require__(53);
let SchedulerService = SchedulerService_1 = class SchedulerService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(SchedulerService_1.name);
    }
    async runMonitoringCycle() {
        this.logger.log('Starting monitoring cycle...');
        const projects = await this.prisma.project.findMany({
            include: { client: { select: { id: true, companyName: true, user: { select: { email: true } } } } },
            where: {
                OR: [
                    { stagingUrl: { not: null } },
                    { productionUrl: { not: null } },
                ],
            },
        });
        for (const project of projects) {
            const urls = [project.productionUrl, project.stagingUrl].filter(Boolean);
            for (const url of urls) {
                try {
                    const hostname = new URL(url).hostname;
                    await Promise.all([
                        this.checkSSL(project.client.id, project.id, hostname),
                        this.checkUptime(project.client.id, project.id, url),
                    ]);
                }
                catch (err) {
                    this.logger.error(`Monitor error for ${url}`, err.message);
                }
            }
        }
        this.logger.log(`Monitoring cycle complete. Checked ${projects.length} projects.`);
    }
    async checkSSL(clientId, projectId, hostname) {
        return new Promise((resolve) => {
            const socket = tls.connect(443, hostname, { servername: hostname, rejectUnauthorized: false }, async () => {
                try {
                    const cert = socket.getPeerCertificate();
                    socket.destroy();
                    if (!cert || !cert.valid_to) {
                        await this.recordSnapshot(clientId, projectId, 'SSL', hostname, 'UNKNOWN', { error: 'No certificate data' });
                        return resolve();
                    }
                    const expiresAt = new Date(cert.valid_to);
                    const daysLeft = Math.floor((expiresAt.getTime() - Date.now()) / 86400000);
                    const issuer = cert.issuer?.O || 'Unknown';
                    const valid = socket.authorized !== false || daysLeft > 0;
                    let status = 'HEALTHY';
                    if (daysLeft <= 0)
                        status = 'CRITICAL';
                    else if (daysLeft <= 14)
                        status = 'WARNING';
                    await this.recordSnapshot(clientId, projectId, 'SSL', hostname, status, {
                        issuer, expiresAt: expiresAt.toISOString(), daysLeft, valid,
                    });
                    if (status !== 'HEALTHY') {
                        await this.createAlertIfNew(clientId, 'SSL', status === 'CRITICAL' ? 'critical' : 'high', `SSL cert ${status === 'CRITICAL' ? 'expired' : 'expiring soon'} — ${hostname}`, `Certificate expires in ${daysLeft} days (${expiresAt.toDateString()})`);
                    }
                }
                catch (err) {
                    socket.destroy();
                    await this.recordSnapshot(clientId, projectId, 'SSL', hostname, 'UNKNOWN', { error: err.message });
                }
                resolve();
            });
            socket.on('error', async (err) => {
                await this.recordSnapshot(clientId, projectId, 'SSL', hostname, 'CRITICAL', { error: err.message });
                await this.createAlertIfNew(clientId, 'SSL', 'critical', `SSL check failed — ${hostname}`, err.message);
                resolve();
            });
            socket.setTimeout(10000, () => { socket.destroy(); resolve(); });
        });
    }
    async checkUptime(clientId, projectId, url) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const lib = url.startsWith('https') ? https : http;
            const req = lib.get(url, { timeout: 10000 }, async (res) => {
                const latencyMs = Date.now() - startTime;
                const statusCode = res.statusCode || 0;
                res.resume();
                let status = 'HEALTHY';
                if (statusCode >= 500)
                    status = 'CRITICAL';
                else if (statusCode >= 400 || latencyMs > 3000)
                    status = 'WARNING';
                await this.recordSnapshot(clientId, projectId, 'UPTIME', url, status, {
                    statusCode, latencyMs, checkedAt: new Date().toISOString(),
                });
                if (status !== 'HEALTHY') {
                    await this.createAlertIfNew(clientId, 'UPTIME', status === 'CRITICAL' ? 'critical' : 'medium', `${status === 'CRITICAL' ? 'Site down' : 'Slow response'} — ${new URL(url).hostname}`, `Status ${statusCode}, latency ${latencyMs}ms`);
                }
                resolve();
            });
            req.on('error', async (err) => {
                await this.recordSnapshot(clientId, projectId, 'UPTIME', url, 'CRITICAL', { error: err.message });
                await this.createAlertIfNew(clientId, 'UPTIME', 'critical', `Site unreachable — ${new URL(url).hostname}`, err.message);
                resolve();
            });
            req.on('timeout', async () => {
                req.destroy();
                await this.recordSnapshot(clientId, projectId, 'UPTIME', url, 'WARNING', { error: 'Request timed out after 10s' });
                resolve();
            });
        });
    }
    async recordSnapshot(clientId, projectId, checkType, target, status, details) {
        await this.prisma.infraSnapshot.create({
            data: { clientId, projectId, checkType, target, status, details: details },
        });
    }
    async createAlertIfNew(clientId, type, severity, title, description) {
        const existing = await this.prisma.alertRecord.findFirst({
            where: { clientId, type, title, resolved: false },
        });
        if (existing)
            return;
        const client = await this.prisma.clientProfile.findUnique({
            where: { id: clientId },
            select: { companyName: true },
        });
        const alert = await this.prisma.alertRecord.create({
            data: { type, severity, title, description, clientId, clientName: client?.companyName },
        });
        if (severity === 'critical' || severity === 'high') {
            await this.notifications.sendAlertNotification({
                title, description, severity, clientName: client?.companyName,
            });
        }
        this.logger.warn(`Alert created [${severity}]: ${title}`);
    }
    async checkDomainExpiry() {
        this.logger.log('Checking domain expiry via snapshot history...');
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
        const staleClients = await this.prisma.clientProfile.findMany({
            where: {
                infraSnapshots: {
                    none: { checkType: 'DOMAIN', checkedAt: { gte: sevenDaysAgo } },
                },
            },
            select: { id: true, companyName: true },
        });
        for (const client of staleClients) {
            await this.createAlertIfNew(client.id, 'DOMAIN', 'medium', `Domain monitoring gap — ${client.companyName}`, 'No domain check recorded in the last 7 days. Configure WHOIS API key to enable automated expiry monitoring.');
        }
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)('0 */6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "runMonitoringCycle", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "checkDomainExpiry", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _b : Object])
], SchedulerService);


/***/ }),
/* 51 */
/***/ ((module) => {

module.exports = require("tls");

/***/ }),
/* 52 */
/***/ ((module) => {

module.exports = require("https");

/***/ }),
/* 53 */
/***/ ((module) => {

module.exports = require("http");

/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsModule = void 0;
const common_1 = __webpack_require__(2);
const projects_service_1 = __webpack_require__(55);
const projects_controller_1 = __webpack_require__(56);
const prisma_module_1 = __webpack_require__(5);
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [projects_service_1.ProjectsService],
        controllers: [projects_controller_1.ProjectsController],
        exports: [projects_service_1.ProjectsService],
    })
], ProjectsModule);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const client_1 = __webpack_require__(7);
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProject(data) {
        return this.prisma.project.create({
            data: {
                clientId: data.clientId,
                projectName: data.projectName,
                description: data.description,
                estimatedEnd: data.estimatedEnd,
                completion: {
                    create: {
                        overallCompletionPercentage: 0,
                        currentPhase: client_1.ProjectPhase.DISCOVERY,
                        status: client_1.ProjectCompletionStatus.ON_TRACK,
                        healthScore: 5,
                    },
                },
                stack: {
                    create: {},
                },
            },
            include: {
                client: true,
                completion: true,
                stack: true,
                milestones: true,
                domains: true,
                subscriptions: true,
            },
        });
    }
    async getProject(projectId) {
        return this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                client: true,
                completion: true,
                stack: true,
                milestones: true,
                domains: true,
                subscriptions: true,
                invoices: true,
            },
        });
    }
    async listProjects(clientId, phase, status) {
        const where = {};
        if (clientId)
            where.clientId = clientId;
        if (phase)
            where.currentPhase = phase;
        if (status)
            where.completion = { status };
        return this.prisma.project.findMany({
            where,
            include: {
                client: true,
                completion: true,
                _count: {
                    select: {
                        milestones: true,
                        domains: true,
                        subscriptions: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateProject(projectId, data) {
        return this.prisma.project.update({
            where: { id: projectId },
            data,
            include: {
                client: true,
                completion: true,
                stack: true,
            },
        });
    }
    async advancePhase(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { completion: true },
        });
        if (!project)
            throw new Error('Project not found');
        const phaseOrder = [
            client_1.ProjectPhase.DISCOVERY,
            client_1.ProjectPhase.UI_UX_DESIGN,
            client_1.ProjectPhase.BACKEND_ARCHITECTURE,
            client_1.ProjectPhase.STAGING,
            client_1.ProjectPhase.PRODUCTION,
            client_1.ProjectPhase.MAINTENANCE,
        ];
        const currentIndex = phaseOrder.indexOf(project.currentPhase);
        const nextPhase = phaseOrder[currentIndex + 1];
        if (!nextPhase)
            return project;
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                currentPhase: nextPhase,
                completion: {
                    update: { currentPhase: nextPhase },
                },
            },
            include: {
                client: true,
                completion: true,
            },
        });
    }
    async getProjectHealth(projectId) {
        return this.prisma.projectCompletion.findUnique({
            where: { projectId },
        });
    }
    async updateProjectHealth(projectId, data) {
        return this.prisma.projectCompletion.update({
            where: { projectId },
            data: {
                ...data,
                lastAssessedAt: new Date(),
            },
        });
    }
    async deleteProject(projectId) {
        return this.prisma.project.delete({
            where: { id: projectId },
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProjectsService);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsController = void 0;
const common_1 = __webpack_require__(2);
const projects_service_1 = __webpack_require__(55);
const client_1 = __webpack_require__(7);
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(data) {
        return this.projectsService.createProject(data);
    }
    list(clientId, phase, status) {
        return this.projectsService.listProjects(clientId, phase, status);
    }
    getProject(projectId) {
        return this.projectsService.getProject(projectId);
    }
    update(projectId, data) {
        return this.projectsService.updateProject(projectId, data);
    }
    advancePhase(projectId) {
        return this.projectsService.advancePhase(projectId);
    }
    getHealth(projectId) {
        return this.projectsService.getProjectHealth(projectId);
    }
    updateHealth(projectId, data) {
        return this.projectsService.updateProjectHealth(projectId, data);
    }
    delete(projectId) {
        return this.projectsService.deleteProject(projectId);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof projects_service_1.CreateProjectDTO !== "undefined" && projects_service_1.CreateProjectDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('clientId')),
    __param(1, (0, common_1.Query)('phase')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof client_1.ProjectPhase !== "undefined" && client_1.ProjectPhase) === "function" ? _c : Object, typeof (_d = typeof client_1.ProjectCompletionStatus !== "undefined" && client_1.ProjectCompletionStatus) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getProject", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof projects_service_1.UpdateProjectDTO !== "undefined" && projects_service_1.UpdateProjectDTO) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/phase'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "advancePhase", null);
__decorate([
    (0, common_1.Get)(':id/health'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Put)(':id/health'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof Partial !== "undefined" && Partial) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateHealth", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "delete", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('v1/projects'),
    __metadata("design:paramtypes", [typeof (_a = typeof projects_service_1.ProjectsService !== "undefined" && projects_service_1.ProjectsService) === "function" ? _a : Object])
], ProjectsController);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomainsModule = void 0;
const common_1 = __webpack_require__(2);
const domains_service_1 = __webpack_require__(58);
const domains_controller_1 = __webpack_require__(59);
const prisma_module_1 = __webpack_require__(5);
let DomainsModule = class DomainsModule {
};
exports.DomainsModule = DomainsModule;
exports.DomainsModule = DomainsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [domains_service_1.DomainsService],
        controllers: [domains_controller_1.DomainsController],
        exports: [domains_service_1.DomainsService],
    })
], DomainsModule);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomainsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const client_1 = __webpack_require__(7);
let DomainsService = class DomainsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDomain(data) {
        const nextRenewalDate = data.expirationDate
            ? new Date(data.expirationDate)
            : undefined;
        return this.prisma.domainManagement.create({
            data: {
                projectId: data.projectId,
                domainName: data.domainName,
                registrar: data.registrar,
                expirationDate: data.expirationDate,
                sslCertProvider: data.sslCertProvider,
                sslExpirationDate: data.sslExpirationDate,
                autoRenew: data.autoRenew ?? true,
                cost: data.cost ? new client_1.Prisma.Decimal(data.cost) : undefined,
                nextRenewalDate,
                status: 'ACTIVE',
            },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async getDomain(domainId) {
        return this.prisma.domainManagement.findUnique({
            where: { id: domainId },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async listDomainsByProject(projectId) {
        return this.prisma.domainManagement.findMany({
            where: { projectId },
            orderBy: { expirationDate: 'asc' },
        });
    }
    async listDomainsExpiringIn(daysThreshold) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        return this.prisma.domainManagement.findMany({
            where: {
                AND: [
                    {
                        expirationDate: {
                            lte: thresholdDate,
                            gte: new Date(),
                        },
                    },
                    {
                        status: { not: 'EXPIRED' },
                    },
                ],
            },
            include: {
                project: { include: { client: true } },
            },
            orderBy: { expirationDate: 'asc' },
        });
    }
    async listSSLExpiringIn(daysThreshold) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        return this.prisma.domainManagement.findMany({
            where: {
                AND: [
                    {
                        sslExpirationDate: {
                            lte: thresholdDate,
                            gte: new Date(),
                        },
                    },
                ],
            },
            include: {
                project: { include: { client: true } },
            },
            orderBy: { sslExpirationDate: 'asc' },
        });
    }
    async updateDomain(domainId, data) {
        return this.prisma.domainManagement.update({
            where: { id: domainId },
            data: {
                domainName: data.domainName,
                registrar: data.registrar,
                expirationDate: data.expirationDate,
                sslCertProvider: data.sslCertProvider,
                sslExpirationDate: data.sslExpirationDate,
                autoRenew: data.autoRenew,
                cost: data.cost ? new client_1.Prisma.Decimal(data.cost) : undefined,
            },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async markDomainRenewed(domainId) {
        const domain = await this.getDomain(domainId);
        if (!domain)
            throw new Error('Domain not found');
        const newExpirationDate = new Date(domain.expirationDate);
        newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);
        return this.prisma.domainManagement.update({
            where: { id: domainId },
            data: {
                expirationDate: newExpirationDate,
                nextRenewalDate: newExpirationDate,
                status: 'ACTIVE',
                renewalAlertSentAt: null,
            },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async markSSLRenewed(domainId) {
        const domain = await this.getDomain(domainId);
        if (!domain)
            throw new Error('Domain not found');
        const newSSLExpiration = new Date(domain.sslExpirationDate);
        newSSLExpiration.setFullYear(newSSLExpiration.getFullYear() + 1);
        return this.prisma.domainManagement.update({
            where: { id: domainId },
            data: {
                sslExpirationDate: newSSLExpiration,
                renewalAlertSentAt: null,
            },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async deleteDomain(domainId) {
        return this.prisma.domainManagement.delete({
            where: { id: domainId },
        });
    }
};
exports.DomainsService = DomainsService;
exports.DomainsService = DomainsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DomainsService);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomainsController = void 0;
const common_1 = __webpack_require__(2);
const domains_service_1 = __webpack_require__(58);
let DomainsController = class DomainsController {
    constructor(domainsService) {
        this.domainsService = domainsService;
    }
    create(data) {
        return this.domainsService.createDomain(data);
    }
    list(projectId) {
        if (projectId) {
            return this.domainsService.listDomainsByProject(projectId);
        }
        return { message: 'Use projectId query parameter' };
    }
    getExpiring(days = 30) {
        return this.domainsService.listDomainsExpiringIn(parseInt(days));
    }
    getSSLExpiring(days = 30) {
        return this.domainsService.listSSLExpiringIn(parseInt(days));
    }
    getDomain(domainId) {
        return this.domainsService.getDomain(domainId);
    }
    update(domainId, data) {
        return this.domainsService.updateDomain(domainId, data);
    }
    renewDomain(domainId) {
        return this.domainsService.markDomainRenewed(domainId);
    }
    renewSSL(domainId) {
        return this.domainsService.markSSLRenewed(domainId);
    }
    delete(domainId) {
        return this.domainsService.deleteDomain(domainId);
    }
};
exports.DomainsController = DomainsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof domains_service_1.CreateDomainDTO !== "undefined" && domains_service_1.CreateDomainDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('expiring'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "getExpiring", null);
__decorate([
    (0, common_1.Get)('ssl/expiring'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "getSSLExpiring", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "getDomain", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Partial !== "undefined" && Partial) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/renew'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "renewDomain", null);
__decorate([
    (0, common_1.Put)(':id/ssl/renew'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "renewSSL", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainsController.prototype, "delete", null);
exports.DomainsController = DomainsController = __decorate([
    (0, common_1.Controller)('v1/domains'),
    __metadata("design:paramtypes", [typeof (_a = typeof domains_service_1.DomainsService !== "undefined" && domains_service_1.DomainsService) === "function" ? _a : Object])
], DomainsController);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionsModule = void 0;
const common_1 = __webpack_require__(2);
const project_subscriptions_service_1 = __webpack_require__(61);
const project_subscriptions_controller_1 = __webpack_require__(62);
const prisma_module_1 = __webpack_require__(5);
let SubscriptionsModule = class SubscriptionsModule {
};
exports.SubscriptionsModule = SubscriptionsModule;
exports.SubscriptionsModule = SubscriptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [project_subscriptions_service_1.ProjectSubscriptionsService],
        controllers: [project_subscriptions_controller_1.ProjectSubscriptionsController],
        exports: [project_subscriptions_service_1.ProjectSubscriptionsService],
    })
], SubscriptionsModule);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectSubscriptionsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const client_1 = __webpack_require__(7);
let ProjectSubscriptionsService = class ProjectSubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSubscription(data) {
        return this.prisma.projectSubscription.create({
            data: {
                projectId: data.projectId,
                serviceName: data.serviceName,
                monthlyCost: new client_1.Prisma.Decimal(data.monthlyCost),
                billingFrequency: data.billingFrequency ?? 'MONTHLY',
                renewalDate: data.renewalDate,
                autoRenew: data.autoRenew ?? true,
                notes: data.notes,
            },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async getSubscription(subscriptionId) {
        return this.prisma.projectSubscription.findUnique({
            where: { id: subscriptionId },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async listSubscriptionsByProject(projectId) {
        return this.prisma.projectSubscription.findMany({
            where: { projectId },
            orderBy: { renewalDate: 'asc' },
        });
    }
    async listSubscriptionsRenewingIn(daysThreshold) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        return this.prisma.projectSubscription.findMany({
            where: {
                AND: [
                    {
                        renewalDate: {
                            lte: thresholdDate,
                            gte: new Date(),
                        },
                    },
                ],
            },
            include: {
                project: { include: { client: true } },
            },
            orderBy: { renewalDate: 'asc' },
        });
    }
    async getTotalMonthlyCost(projectId) {
        const result = await this.prisma.projectSubscription.aggregate({
            where: {
                projectId,
                billingFrequency: 'MONTHLY',
            },
            _sum: {
                monthlyCost: true,
            },
        });
        return result._sum.monthlyCost || new client_1.Prisma.Decimal(0);
    }
    async updateSubscription(subscriptionId, data) {
        return this.prisma.projectSubscription.update({
            where: { id: subscriptionId },
            data: {
                serviceName: data.serviceName,
                monthlyCost: data.monthlyCost ? new client_1.Prisma.Decimal(data.monthlyCost) : undefined,
                billingFrequency: data.billingFrequency,
                renewalDate: data.renewalDate,
                autoRenew: data.autoRenew,
                notes: data.notes,
            },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async markSubscriptionRenewed(subscriptionId) {
        const subscription = await this.getSubscription(subscriptionId);
        if (!subscription)
            throw new Error('Subscription not found');
        const newRenewalDate = new Date(subscription.renewalDate);
        if (subscription.billingFrequency === 'ANNUAL') {
            newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
        }
        else if (subscription.billingFrequency === 'MONTHLY') {
            newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
        }
        else {
            return subscription;
        }
        return this.prisma.projectSubscription.update({
            where: { id: subscriptionId },
            data: {
                renewalDate: newRenewalDate,
                alertSentAt: null,
            },
            include: {
                project: { include: { client: true } },
            },
        });
    }
    async deleteSubscription(subscriptionId) {
        return this.prisma.projectSubscription.delete({
            where: { id: subscriptionId },
        });
    }
};
exports.ProjectSubscriptionsService = ProjectSubscriptionsService;
exports.ProjectSubscriptionsService = ProjectSubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProjectSubscriptionsService);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectSubscriptionsController = void 0;
const common_1 = __webpack_require__(2);
const project_subscriptions_service_1 = __webpack_require__(61);
let ProjectSubscriptionsController = class ProjectSubscriptionsController {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    create(data) {
        return this.subscriptionsService.createSubscription(data);
    }
    list(projectId) {
        if (projectId) {
            return this.subscriptionsService.listSubscriptionsByProject(projectId);
        }
        return { message: 'Use projectId query parameter' };
    }
    getRenewing(days = 7) {
        return this.subscriptionsService.listSubscriptionsRenewingIn(parseInt(days));
    }
    getSubscription(subscriptionId) {
        return this.subscriptionsService.getSubscription(subscriptionId);
    }
    getTotalCost(projectId) {
        return this.subscriptionsService.getTotalMonthlyCost(projectId);
    }
    update(subscriptionId, data) {
        return this.subscriptionsService.updateSubscription(subscriptionId, data);
    }
    renewSubscription(subscriptionId) {
        return this.subscriptionsService.markSubscriptionRenewed(subscriptionId);
    }
    delete(subscriptionId) {
        return this.subscriptionsService.deleteSubscription(subscriptionId);
    }
};
exports.ProjectSubscriptionsController = ProjectSubscriptionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof project_subscriptions_service_1.CreateSubscriptionDTO !== "undefined" && project_subscriptions_service_1.CreateSubscriptionDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('renewing'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "getRenewing", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Get)(':projectId/total-cost'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "getTotalCost", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Partial !== "undefined" && Partial) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/renew'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "renewSubscription", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectSubscriptionsController.prototype, "delete", null);
exports.ProjectSubscriptionsController = ProjectSubscriptionsController = __decorate([
    (0, common_1.Controller)('v1/project-subscriptions'),
    __metadata("design:paramtypes", [typeof (_a = typeof project_subscriptions_service_1.ProjectSubscriptionsService !== "undefined" && project_subscriptions_service_1.ProjectSubscriptionsService) === "function" ? _a : Object])
], ProjectSubscriptionsController);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertsModule = void 0;
const common_1 = __webpack_require__(2);
const alerts_service_1 = __webpack_require__(64);
const alerts_controller_1 = __webpack_require__(65);
const prisma_module_1 = __webpack_require__(5);
const domains_module_1 = __webpack_require__(57);
const subscriptions_module_1 = __webpack_require__(60);
let AlertsModule = class AlertsModule {
};
exports.AlertsModule = AlertsModule;
exports.AlertsModule = AlertsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, domains_module_1.DomainsModule, subscriptions_module_1.SubscriptionsModule],
        providers: [alerts_service_1.AlertsService],
        controllers: [alerts_controller_1.AlertsController],
        exports: [alerts_service_1.AlertsService],
    })
], AlertsModule);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const client_1 = __webpack_require__(7);
const domains_service_1 = __webpack_require__(58);
const project_subscriptions_service_1 = __webpack_require__(61);
let AlertsService = class AlertsService {
    constructor(prisma, domainsService, subscriptionsService) {
        this.prisma = prisma;
        this.domainsService = domainsService;
        this.subscriptionsService = subscriptionsService;
    }
    async createAlertTrigger(data) {
        return this.prisma.alertTrigger.create({
            data: {
                type: data.type,
                daysBeforeExpiry: data.daysBeforeExpiry,
                channels: data.channels ?? [client_1.AlertChannel.IN_APP, client_1.AlertChannel.EMAIL],
                recipients: data.recipients ?? [],
                enabled: data.enabled ?? true,
            },
        });
    }
    async getAlertTrigger(triggerId) {
        return this.prisma.alertTrigger.findUnique({
            where: { id: triggerId },
        });
    }
    async listAlertTriggers(type) {
        return this.prisma.alertTrigger.findMany({
            where: type ? { type, enabled: true } : { enabled: true },
        });
    }
    async getDomainRenewalAlerts() {
        const trigger = await this.prisma.alertTrigger.findFirst({
            where: {
                type: client_1.AlertType.DOMAIN_RENEWAL,
                enabled: true,
            },
        });
        if (!trigger) {
            return [];
        }
        return this.domainsService.listDomainsExpiringIn(trigger.daysBeforeExpiry);
    }
    async getSSLRenewalAlerts() {
        const trigger = await this.prisma.alertTrigger.findFirst({
            where: {
                type: client_1.AlertType.DOMAIN_RENEWAL,
                enabled: true,
            },
        });
        if (!trigger) {
            return [];
        }
        return this.domainsService.listSSLExpiringIn(trigger.daysBeforeExpiry);
    }
    async getSubscriptionRenewalAlerts() {
        const trigger = await this.prisma.alertTrigger.findFirst({
            where: {
                type: client_1.AlertType.SUBSCRIPTION_RENEWAL,
                enabled: true,
            },
        });
        if (!trigger) {
            return [];
        }
        return this.subscriptionsService.listSubscriptionsRenewingIn(trigger.daysBeforeExpiry);
    }
    async getProjectBehindScheduleAlerts() {
        return this.prisma.projectCompletion.findMany({
            where: {
                AND: [
                    { status: { in: ['AT_RISK', 'BLOCKED'] } },
                ],
            },
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
            },
            orderBy: { lastAssessedAt: 'desc' },
        });
    }
    async getInvoiceOverdueAlerts() {
        return this.prisma.invoice.findMany({
            where: {
                status: 'OVERDUE',
            },
            include: {
                client: true,
                project: true,
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async updateAlertTrigger(triggerId, data) {
        return this.prisma.alertTrigger.update({
            where: { id: triggerId },
            data,
        });
    }
    async deleteAlertTrigger(triggerId) {
        return this.prisma.alertTrigger.delete({
            where: { id: triggerId },
        });
    }
    async markDomainAlertSent(domainId) {
        return this.prisma.domainManagement.update({
            where: { id: domainId },
            data: {
                renewalAlertSentAt: new Date(),
            },
        });
    }
    async markSubscriptionAlertSent(subscriptionId) {
        return this.prisma.projectSubscription.update({
            where: { id: subscriptionId },
            data: {
                alertSentAt: new Date(),
            },
        });
    }
    async getAlertsSummary() {
        const [domainAlerts, sslAlerts, subscriptionAlerts, projectAlerts, invoiceAlerts,] = await Promise.all([
            this.getDomainRenewalAlerts(),
            this.getSSLRenewalAlerts(),
            this.getSubscriptionRenewalAlerts(),
            this.getProjectBehindScheduleAlerts(),
            this.getInvoiceOverdueAlerts(),
        ]);
        return {
            domainRenewals: domainAlerts,
            sslRenewals: sslAlerts,
            subscriptionRenewals: subscriptionAlerts,
            projectsAtRisk: projectAlerts,
            overdueInvoices: invoiceAlerts,
            totalAlerts: domainAlerts.length +
                sslAlerts.length +
                subscriptionAlerts.length +
                projectAlerts.length +
                invoiceAlerts.length,
        };
    }
    async getAlertsForProject(projectId) {
        const [domains, subscriptions, completion] = await Promise.all([
            this.domainsService.listDomainsByProject(projectId),
            this.subscriptionsService.listSubscriptionsByProject(projectId),
            this.prisma.projectCompletion.findUnique({
                where: { projectId },
            }),
        ]);
        const alerts = [];
        const domainTrigger = await this.prisma.alertTrigger.findFirst({
            where: { type: client_1.AlertType.DOMAIN_RENEWAL, enabled: true },
        });
        if (domainTrigger) {
            domains.forEach((domain) => {
                if (domain.expirationDate) {
                    const daysUntilExpiry = Math.floor((domain.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    if (daysUntilExpiry <= domainTrigger.daysBeforeExpiry && daysUntilExpiry >= 0) {
                        const severity = daysUntilExpiry < 7 ? 'CRITICAL' : daysUntilExpiry < 30 ? 'WARNING' : 'INFO';
                        alerts.push({
                            type: 'DOMAIN_RENEWAL',
                            severity,
                            title: `Domain expires in ${daysUntilExpiry} days`,
                            description: `${domain.domainName} expires on ${domain.expirationDate.toDateString()}`,
                            data: domain,
                        });
                    }
                }
            });
        }
        const subscriptionTrigger = await this.prisma.alertTrigger.findFirst({
            where: { type: client_1.AlertType.SUBSCRIPTION_RENEWAL, enabled: true },
        });
        if (subscriptionTrigger) {
            subscriptions.forEach((sub) => {
                if (sub.renewalDate) {
                    const daysUntilRenewal = Math.floor((sub.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    if (daysUntilRenewal <= subscriptionTrigger.daysBeforeExpiry && daysUntilRenewal >= 0) {
                        const severity = daysUntilRenewal < 7 ? 'WARNING' : 'INFO';
                        alerts.push({
                            type: 'SUBSCRIPTION_RENEWAL',
                            severity,
                            title: `${sub.serviceName} renews in ${daysUntilRenewal} days`,
                            description: `Cost: $${sub.monthlyCost}/${sub.billingFrequency.toLowerCase()}`,
                            data: sub,
                        });
                    }
                }
            });
        }
        if (completion && ['AT_RISK', 'BLOCKED'].includes(completion.status)) {
            alerts.push({
                type: 'PROJECT_BEHIND_SCHEDULE',
                severity: completion.status === 'BLOCKED' ? 'CRITICAL' : 'WARNING',
                title: `Project is ${completion.status.toLowerCase()}`,
                description: completion.riskFactors.join(', '),
                data: completion,
            });
        }
        return alerts;
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof domains_service_1.DomainsService !== "undefined" && domains_service_1.DomainsService) === "function" ? _b : Object, typeof (_c = typeof project_subscriptions_service_1.ProjectSubscriptionsService !== "undefined" && project_subscriptions_service_1.ProjectSubscriptionsService) === "function" ? _c : Object])
], AlertsService);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertsController = void 0;
const common_1 = __webpack_require__(2);
const alerts_service_1 = __webpack_require__(64);
const client_1 = __webpack_require__(7);
let AlertsController = class AlertsController {
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    createTrigger(data) {
        return this.alertsService.createAlertTrigger(data);
    }
    listTriggers(type) {
        return this.alertsService.listAlertTriggers(type);
    }
    getTrigger(triggerId) {
        return this.alertsService.getAlertTrigger(triggerId);
    }
    updateTrigger(triggerId, data) {
        return this.alertsService.updateAlertTrigger(triggerId, data);
    }
    deleteTrigger(triggerId) {
        return this.alertsService.deleteAlertTrigger(triggerId);
    }
    getDomainAlerts() {
        return this.alertsService.getDomainRenewalAlerts();
    }
    getSSLAlerts() {
        return this.alertsService.getSSLRenewalAlerts();
    }
    getSubscriptionAlerts() {
        return this.alertsService.getSubscriptionRenewalAlerts();
    }
    getProjectBehindAlerts() {
        return this.alertsService.getProjectBehindScheduleAlerts();
    }
    getInvoiceAlerts() {
        return this.alertsService.getInvoiceOverdueAlerts();
    }
    getSummary() {
        return this.alertsService.getAlertsSummary();
    }
    getAlertsForProject(projectId) {
        return this.alertsService.getAlertsForProject(projectId);
    }
    markDomainAlertSent(domainId) {
        return this.alertsService.markDomainAlertSent(domainId);
    }
    markSubscriptionAlertSent(subscriptionId) {
        return this.alertsService.markSubscriptionAlertSent(subscriptionId);
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Post)('triggers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof alerts_service_1.CreateAlertTriggerDTO !== "undefined" && alerts_service_1.CreateAlertTriggerDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "createTrigger", null);
__decorate([
    (0, common_1.Get)('triggers'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof client_1.AlertType !== "undefined" && client_1.AlertType) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "listTriggers", null);
__decorate([
    (0, common_1.Get)('triggers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getTrigger", null);
__decorate([
    (0, common_1.Put)('triggers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "updateTrigger", null);
__decorate([
    (0, common_1.Delete)('triggers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "deleteTrigger", null);
__decorate([
    (0, common_1.Get)('domain-renewal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getDomainAlerts", null);
__decorate([
    (0, common_1.Get)('ssl-renewal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getSSLAlerts", null);
__decorate([
    (0, common_1.Get)('subscription-renewal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getSubscriptionAlerts", null);
__decorate([
    (0, common_1.Get)('project-behind'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getProjectBehindAlerts", null);
__decorate([
    (0, common_1.Get)('invoice-overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getInvoiceAlerts", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getAlertsForProject", null);
__decorate([
    (0, common_1.Put)('domain/:domainId/mark-sent'),
    __param(0, (0, common_1.Param)('domainId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "markDomainAlertSent", null);
__decorate([
    (0, common_1.Put)('subscription/:subscriptionId/mark-sent'),
    __param(0, (0, common_1.Param)('subscriptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "markSubscriptionAlertSent", null);
exports.AlertsController = AlertsController = __decorate([
    (0, common_1.Controller)('v1/alerts'),
    __metadata("design:paramtypes", [typeof (_a = typeof alerts_service_1.AlertsService !== "undefined" && alerts_service_1.AlertsService) === "function" ? _a : Object])
], AlertsController);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MilestonesModule = void 0;
const common_1 = __webpack_require__(2);
const milestones_service_1 = __webpack_require__(67);
const milestones_controller_1 = __webpack_require__(68);
const prisma_module_1 = __webpack_require__(5);
let MilestonesModule = class MilestonesModule {
};
exports.MilestonesModule = MilestonesModule;
exports.MilestonesModule = MilestonesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [milestones_service_1.MilestonesService],
        controllers: [milestones_controller_1.MilestonesController],
        exports: [milestones_service_1.MilestonesService],
    })
], MilestonesModule);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MilestonesService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let MilestonesService = class MilestonesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMilestone(data) {
        return this.prisma.projectMilestone.create({
            data: {
                projectId: data.projectId,
                phase: data.phase,
                title: data.title,
                description: data.description,
                targetDate: data.targetDate,
                completionPercentage: data.completionPercentage || 0,
                status: 'NOT_STARTED',
            },
            include: {
                project: true,
            },
        });
    }
    async getMilestonesByProject(projectId) {
        return this.prisma.projectMilestone.findMany({
            where: { projectId },
            orderBy: { targetDate: 'asc' },
        });
    }
    async getMilestonesByPhase(projectId, phase) {
        return this.prisma.projectMilestone.findMany({
            where: { projectId, phase },
            orderBy: { targetDate: 'asc' },
        });
    }
    async getMilestone(milestoneId) {
        return this.prisma.projectMilestone.findUnique({
            where: { id: milestoneId },
            include: { project: true },
        });
    }
    async updateMilestone(milestoneId, data) {
        return this.prisma.projectMilestone.update({
            where: { id: milestoneId },
            data: {
                title: data.title,
                description: data.description,
                targetDate: data.targetDate,
                completionPercentage: data.completionPercentage,
                phase: data.phase,
            },
            include: { project: true },
        });
    }
    async updateMilestoneStatus(milestoneId, status, completionPercentage) {
        return this.prisma.projectMilestone.update({
            where: { id: milestoneId },
            data: {
                status,
                completionPercentage: completionPercentage !== undefined ? completionPercentage : undefined,
                isCompleted: status === 'COMPLETE',
                completedAt: status === 'COMPLETE' ? new Date() : null,
            },
            include: { project: true },
        });
    }
    async deleteMilestone(milestoneId) {
        return this.prisma.projectMilestone.delete({
            where: { id: milestoneId },
        });
    }
    async updateProjectCompletionFromMilestones(projectId) {
        const milestones = await this.prisma.projectMilestone.findMany({
            where: { projectId },
        });
        if (milestones.length === 0)
            return;
        const avgCompletion = milestones.reduce((sum, m) => sum + m.completionPercentage, 0) /
            milestones.length;
        await this.prisma.projectCompletion.update({
            where: { projectId },
            data: {
                overallCompletionPercentage: Math.round(avgCompletion),
                lastAssessedAt: new Date(),
            },
        });
    }
};
exports.MilestonesService = MilestonesService;
exports.MilestonesService = MilestonesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MilestonesService);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MilestonesController = void 0;
const common_1 = __webpack_require__(2);
const milestones_service_1 = __webpack_require__(67);
const client_1 = __webpack_require__(7);
let MilestonesController = class MilestonesController {
    constructor(milestonesService) {
        this.milestonesService = milestonesService;
    }
    create(data) {
        return this.milestonesService.createMilestone(data);
    }
    getByProject(projectId) {
        return this.milestonesService.getMilestonesByProject(projectId);
    }
    getByPhase(projectId, phase) {
        return this.milestonesService.getMilestonesByPhase(projectId, phase);
    }
    get(milestoneId) {
        return this.milestonesService.getMilestone(milestoneId);
    }
    update(milestoneId, data) {
        return this.milestonesService.updateMilestone(milestoneId, data);
    }
    updateStatus(milestoneId, data) {
        return this.milestonesService.updateMilestoneStatus(milestoneId, data.status, data.completionPercentage);
    }
    delete(milestoneId) {
        return this.milestonesService.deleteMilestone(milestoneId);
    }
};
exports.MilestonesController = MilestonesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof milestones_service_1.CreateMilestoneDTO !== "undefined" && milestones_service_1.CreateMilestoneDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "getByProject", null);
__decorate([
    (0, common_1.Get)('project/:projectId/phase/:phase'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('phase')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof client_1.ProjectPhase !== "undefined" && client_1.ProjectPhase) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "getByPhase", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "delete", null);
exports.MilestonesController = MilestonesController = __decorate([
    (0, common_1.Controller)('v1/milestones'),
    __metadata("design:paramtypes", [typeof (_a = typeof milestones_service_1.MilestonesService !== "undefined" && milestones_service_1.MilestonesService) === "function" ? _a : Object])
], MilestonesController);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TeamModule = void 0;
const common_1 = __webpack_require__(2);
const team_service_1 = __webpack_require__(70);
const team_controller_1 = __webpack_require__(71);
const prisma_module_1 = __webpack_require__(5);
let TeamModule = class TeamModule {
};
exports.TeamModule = TeamModule;
exports.TeamModule = TeamModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [team_service_1.TeamService],
        controllers: [team_controller_1.TeamController],
        exports: [team_service_1.TeamService],
    })
], TeamModule);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TeamService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const teamMembers = new Map();
let TeamService = class TeamService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTeamMember(data) {
        const member = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        if (!teamMembers.has(data.projectId)) {
            teamMembers.set(data.projectId, []);
        }
        teamMembers.get(data.projectId).push(member);
        return member;
    }
    async getTeamByProject(projectId) {
        return teamMembers.get(projectId) || [];
    }
    async getTeamMember(projectId, memberId) {
        const team = teamMembers.get(projectId) || [];
        return team.find((m) => m.id === memberId);
    }
    async updateTeamMember(projectId, memberId, data) {
        const team = teamMembers.get(projectId) || [];
        const index = team.findIndex((m) => m.id === memberId);
        if (index === -1)
            return null;
        team[index] = { ...team[index], ...data, updatedAt: new Date() };
        return team[index];
    }
    async deleteTeamMember(projectId, memberId) {
        const team = teamMembers.get(projectId) || [];
        const filtered = team.filter((m) => m.id !== memberId);
        teamMembers.set(projectId, filtered);
        return true;
    }
    async getTeamCapacityUtilization(projectId) {
        const team = await this.getTeamByProject(projectId);
        const totalCapacity = team.reduce((sum, m) => sum + m.capacityAllocation, 0);
        const avgCapacity = team.length > 0 ? totalCapacity / team.length : 0;
        return {
            teamSize: team.length,
            totalAllocated: totalCapacity,
            averageCapacity: Math.round(avgCapacity),
            members: team,
        };
    }
    async assignPhase(projectId, memberId, phase) {
        const member = await this.getTeamMember(projectId, memberId);
        if (!member)
            return null;
        if (!member.assignedPhases.includes(phase)) {
            member.assignedPhases.push(phase);
        }
        return this.updateTeamMember(projectId, memberId, member);
    }
    async unassignPhase(projectId, memberId, phase) {
        const member = await this.getTeamMember(projectId, memberId);
        if (!member)
            return null;
        member.assignedPhases = member.assignedPhases.filter((p) => p !== phase);
        return this.updateTeamMember(projectId, memberId, member);
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TeamService);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TeamController = void 0;
const common_1 = __webpack_require__(2);
const team_service_1 = __webpack_require__(70);
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    create(data) {
        return this.teamService.createTeamMember({
            ...data,
            assignedPhases: data.assignedPhases || [],
        });
    }
    getByProject(projectId) {
        return this.teamService.getTeamByProject(projectId);
    }
    getCapacity(projectId) {
        return this.teamService.getTeamCapacityUtilization(projectId);
    }
    getMember(projectId, memberId) {
        return this.teamService.getTeamMember(projectId, memberId);
    }
    update(projectId, memberId, data) {
        return this.teamService.updateTeamMember(projectId, memberId, data);
    }
    delete(projectId, memberId) {
        return this.teamService.deleteTeamMember(projectId, memberId);
    }
    assignPhase(projectId, memberId, data) {
        return this.teamService.assignPhase(projectId, memberId, data.phase);
    }
    unassignPhase(projectId, memberId, data) {
        return this.teamService.unassignPhase(projectId, memberId, data.phase);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "getByProject", null);
__decorate([
    (0, common_1.Get)('project/:projectId/capacity'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "getCapacity", null);
__decorate([
    (0, common_1.Get)('project/:projectId/member/:memberId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "getMember", null);
__decorate([
    (0, common_1.Put)('project/:projectId/member/:memberId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('project/:projectId/member/:memberId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)('project/:projectId/member/:memberId/assign-phase'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "assignPhase", null);
__decorate([
    (0, common_1.Put)('project/:projectId/member/:memberId/unassign-phase'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "unassignPhase", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.Controller)('v1/team'),
    __metadata("design:paramtypes", [typeof (_a = typeof team_service_1.TeamService !== "undefined" && team_service_1.TeamService) === "function" ? _a : Object])
], TeamController);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:5174',
        /^https:\/\/.*\.vercel\.app$/,
    ];
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🚀 STORMGLIDE.IO COMMAND CENTER - ONLINE               ║
  ║                                                           ║
  ║   Backend API: http://localhost:${port}                     ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
  ║                                                           ║
  ║   Modules Active:                                         ║
  ║   ✓ Authentication (JWT Magic Links)                     ║
  ║   ✓ CRM & Job Tracking                                   ║
  ║   ✓ Multi-Currency Billing Engine                        ║
  ║   ✓ AI Blueprint Generator (Lab)                         ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();

})();

/******/ })()
;