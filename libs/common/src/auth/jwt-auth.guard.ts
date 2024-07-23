import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
        const response = context.switchToHttp().getResponse();

        if (!jwt) {
            throw new UnauthorizedException('Token not found');
        }

        return this.authClient.send('authenticate', {
            Authentication: jwt
        }).pipe(
            tap((res) => {
                console.log(res);
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true),
            catchError(() => {
                response.clearCookie('Authentication').status(401).json({ msg: 'Invalid token' });
                return of(false);
            })
        );
    }
}
