import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('Authentication protocol not initialized.');
        }

        // OMEGA role has absolute authority over all ADMIN protocols
        const userRole = user.role;
        const hasPermission = requiredRoles.includes(userRole) ||
            (requiredRoles.includes(Role.ADMIN) && userRole === Role.OMEGA);

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions to access this protocol.');
        }

        return true;
    }
}
