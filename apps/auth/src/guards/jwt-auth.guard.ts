import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { TokenService } from '@app/common/token/token.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(UsersService) private usersService: UsersService
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token = this.extractTokenFromRequest(request);

        const configService = new ConfigService();
        const jwtService = new JwtService();

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const payload = await jwtService.verifyAsync(token, {
                secret: configService.get('JWT_SECRET')
            });
            request['user'] = payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                const { userId } = jwtService.decode(token);
                const user = this.usersService.getUserById({ id: userId });
                const newToken = this.tokenService.createToken({ userId });
                const expires = new Date();
                expires.setSeconds(expires.getSeconds() + configService.get('JWT_EXPIRATION'));
                response.cookie('Authentication', newToken, {
                    httpOnly: true,
                    expires
                });
                request.user = user;
                return true;
            } else {
                response.clearCookie('Authentication');
            }
        }
        await super.canActivate(context);
        return true;
    }

    private extractTokenFromRequest(request: Request): string | undefined {
        const extractor = ExtractJwt.fromExtractors([
            (req: Request) => req?.cookies?.Authentication
        ]);
        return extractor(request);
    }
}
