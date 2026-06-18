/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_module_1 = __webpack_require__(/*! ./prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/auth/auth.module.ts");
const crm_module_1 = __webpack_require__(/*! ./crm/crm.module */ "./src/crm/crm.module.ts");
const billing_module_1 = __webpack_require__(/*! ./billing/billing.module */ "./src/billing/billing.module.ts");
const lab_module_1 = __webpack_require__(/*! ./lab/lab.module */ "./src/lab/lab.module.ts");
const events_module_1 = __webpack_require__(/*! ./events/events.module */ "./src/events/events.module.ts");
const settings_module_1 = __webpack_require__(/*! ./settings/settings.module */ "./src/settings/settings.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            crm_module_1.CrmModule,
            billing_module_1.BillingModule,
            lab_module_1.LabModule,
            events_module_1.EventsModule,
            settings_module_1.SettingsModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
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

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/auth/auth.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt_auth_guard_1 = __webpack_require__(/*! ./guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
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

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
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
            this.logger.log(`[SIMULATED EMAIL DISPATCH] Magic Link sent to ${email}. URL: ${magicLinkUrl}`);
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
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),

/***/ "./src/auth/decorators/roles.decorator.ts":
/*!************************************************!*\
  !*** ./src/auth/decorators/roles.decorator.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/auth/guards/jwt-auth.guard.ts":
/*!*******************************************!*\
  !*** ./src/auth/guards/jwt-auth.guard.ts ***!
  \*******************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
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

/***/ "./src/auth/guards/roles.guard.ts":
/*!****************************************!*\
  !*** ./src/auth/guards/roles.guard.ts ***!
  \****************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const roles_decorator_1 = __webpack_require__(/*! ../decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
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

/***/ "./src/billing/billing.controller.ts":
/*!*******************************************!*\
  !*** ./src/billing/billing.controller.ts ***!
  \*******************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const billing_service_1 = __webpack_require__(/*! ./billing.service */ "./src/billing/billing.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
let BillingController = class BillingController {
    constructor(billingService) {
        this.billingService = billingService;
    }
    async createInvoice(clientId, body) {
        return await this.billingService.generateInvoice(clientId, body);
    }
    async handlePaystackWebhook(body, signature) {
        return await this.billingService.processPaystackWebhook(body);
    }
    async handleStripeWebhook(body, signature) {
        return await this.billingService.processStripeWebhook(body);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('invoice/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoice", null);
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

/***/ "./src/billing/billing.module.ts":
/*!***************************************!*\
  !*** ./src/billing/billing.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const billing_service_1 = __webpack_require__(/*! ./billing.service */ "./src/billing/billing.service.ts");
const billing_controller_1 = __webpack_require__(/*! ./billing.controller */ "./src/billing/billing.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/auth/auth.module.ts");
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

/***/ "./src/billing/billing.service.ts":
/*!****************************************!*\
  !*** ./src/billing/billing.service.ts ***!
  \****************************************/
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let BillingService = BillingService_1 = class BillingService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BillingService_1.name);
    }
    async generateInvoice(clientId, data) {
        const client = await this.prisma.clientProfile.findUnique({ where: { id: clientId } });
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
                    dueDate: data.dueDate,
                    status: client_1.InvoiceStatus.DRAFT,
                },
            });
            this.logger.log(`Generated ${normalizedCurrency} Invoice ${invoiceNumber} routed via ${selectedGateway}`);
            return invoice;
        }
        catch (error) {
            this.logger.error('Failed to generate invoice', error.stack);
            throw new common_1.InternalServerErrorException('Billing engine failure during invoice generation.');
        }
    }
    async processPaystackWebhook(payload) {
        if (payload.event === 'charge.success') {
            const transactionId = payload.data.reference;
            const invoiceId = payload.data.metadata.invoice_id;
            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: client_1.InvoiceStatus.PAID,
                    paidAt: new Date(),
                    transactionId: transactionId,
                },
            });
            this.logger.log(`Paystack Payment Success. Invoice ${invoiceId} marked as PAID via Mobile Money/Card.`);
        }
        return { received: true };
    }
    async processStripeWebhook(payload) {
        if (payload.type === 'checkout.session.completed') {
            const session = payload.data.object;
            const invoiceId = session.client_reference_id;
            await this.prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: client_1.InvoiceStatus.PAID,
                    paidAt: new Date(),
                    transactionId: session.payment_intent,
                },
            });
            this.logger.log(`Stripe Payment Success. Invoice ${invoiceId} marked as PAID via Credit Card.`);
        }
        return { received: true };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BillingService);


/***/ }),

/***/ "./src/crm/crm.controller.ts":
/*!***********************************!*\
  !*** ./src/crm/crm.controller.ts ***!
  \***********************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crm_service_1 = __webpack_require__(/*! ./crm.service */ "./src/crm/crm.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
let CrmController = class CrmController {
    constructor(crmService) {
        this.crmService = crmService;
    }
    async createLead(body) {
        return await this.crmService.createLead(body);
    }
    async createClient(body) {
        return await this.crmService.createClientProfile(body.userId, body);
    }
    async createProject(clientId, body) {
        return await this.crmService.initializeProject(clientId, body);
    }
    async updatePhase(projectId, body) {
        return await this.crmService.advanceProjectPhase(projectId, body.newPhase);
    }
    async submitFeedback(projectId, body) {
        return await this.crmService.logStagingFeedback(projectId, body.clientId, body);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.Post)('lead'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createLead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('client'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createClient", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('project/:clientId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createProject", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)('project/:projectId/phase'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updatePhase", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('project/:projectId/feedback'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.CLIENT),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "submitFeedback", null);
exports.CrmController = CrmController = __decorate([
    (0, common_1.Controller)('v1/crm'),
    __metadata("design:paramtypes", [typeof (_a = typeof crm_service_1.CrmService !== "undefined" && crm_service_1.CrmService) === "function" ? _a : Object])
], CrmController);


/***/ }),

/***/ "./src/crm/crm.module.ts":
/*!*******************************!*\
  !*** ./src/crm/crm.module.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrmModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crm_service_1 = __webpack_require__(/*! ./crm.service */ "./src/crm/crm.service.ts");
const crm_controller_1 = __webpack_require__(/*! ./crm.controller */ "./src/crm/crm.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/auth/auth.module.ts");
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

/***/ "./src/crm/crm.service.ts":
/*!********************************!*\
  !*** ./src/crm/crm.service.ts ***!
  \********************************/
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrmService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let CrmService = CrmService_1 = class CrmService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CrmService_1.name);
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
                { projectId: project.id, phase: client_1.ProjectPhase.DISCOVERY, title: 'Deep Discovery & Requirements Gathering' },
                { projectId: project.id, phase: client_1.ProjectPhase.UI_UX_DESIGN, title: 'UI/UX Interactive Prototyping' },
                { projectId: project.id, phase: client_1.ProjectPhase.BACKEND_ARCHITECTURE, title: 'Database Schema & API Architecture' },
                { projectId: project.id, phase: client_1.ProjectPhase.STAGING, title: 'Live Staging Sandbox Deployment' },
                { projectId: project.id, phase: client_1.ProjectPhase.PRODUCTION, title: 'Production Launch & Handover' },
            ],
        });
        this.logger.log(`Project initialized. Job ID: ${project.id} assigned to ${client.companyName}`);
        return project;
    }
    async advanceProjectPhase(projectId, newPhase) {
        const project = await this.prisma.project.update({
            where: { id: projectId },
            data: { currentPhase: newPhase },
            include: { client: true }
        });
        await this.prisma.projectMilestone.updateMany({
            where: { projectId, phase: newPhase },
            data: { isCompleted: true, completedAt: new Date() }
        });
        this.logger.log(`Project ${project.projectName} advanced to ${newPhase}. Notify client via CRM.`);
        return project;
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
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CrmService);


/***/ }),

/***/ "./src/events/events.gateway.ts":
/*!**************************************!*\
  !*** ./src/events/events.gateway.ts ***!
  \**************************************/
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
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
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

/***/ "./src/events/events.module.ts":
/*!*************************************!*\
  !*** ./src/events/events.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const events_gateway_1 = __webpack_require__(/*! ./events.gateway */ "./src/events/events.gateway.ts");
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

/***/ "./src/lab/lab.controller.ts":
/*!***********************************!*\
  !*** ./src/lab/lab.controller.ts ***!
  \***********************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const lab_service_1 = __webpack_require__(/*! ./lab.service */ "./src/lab/lab.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
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

/***/ "./src/lab/lab.module.ts":
/*!*******************************!*\
  !*** ./src/lab/lab.module.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const lab_service_1 = __webpack_require__(/*! ./lab.service */ "./src/lab/lab.service.ts");
const lab_controller_1 = __webpack_require__(/*! ./lab.controller */ "./src/lab/lab.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/auth/auth.module.ts");
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

/***/ "./src/lab/lab.service.ts":
/*!********************************!*\
  !*** ./src/lab/lab.service.ts ***!
  \********************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const generative_ai_1 = __webpack_require__(/*! @google/generative-ai */ "@google/generative-ai");
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

/***/ "./src/prisma/prisma.module.ts":
/*!*************************************!*\
  !*** ./src/prisma/prisma.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/prisma/prisma.service.ts");
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

/***/ "./src/prisma/prisma.service.ts":
/*!**************************************!*\
  !*** ./src/prisma/prisma.service.ts ***!
  \**************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
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

/***/ "./src/settings/settings.controller.ts":
/*!*********************************************!*\
  !*** ./src/settings/settings.controller.ts ***!
  \*********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const settings_service_1 = __webpack_require__(/*! ./settings.service */ "./src/settings/settings.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/auth/decorators/roles.decorator.ts");
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

/***/ "./src/settings/settings.module.ts":
/*!*****************************************!*\
  !*** ./src/settings/settings.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const settings_service_1 = __webpack_require__(/*! ./settings.service */ "./src/settings/settings.service.ts");
const settings_controller_1 = __webpack_require__(/*! ./settings.controller */ "./src/settings/settings.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/auth/auth.module.ts");
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

/***/ "./src/settings/settings.service.ts":
/*!******************************************!*\
  !*** ./src/settings/settings.service.ts ***!
  \******************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
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

/***/ "@google/generative-ai":
/*!****************************************!*\
  !*** external "@google/generative-ai" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/websockets":
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

/******/ 	});
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
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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