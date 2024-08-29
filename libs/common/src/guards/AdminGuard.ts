import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Roles } from 'apps/auth/src/roles/types/roles.enum';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user.role.name !== Roles.Admin) {
            throw new ForbiddenException('Access denied: Admins only');
        }

        return true;
    }
}
