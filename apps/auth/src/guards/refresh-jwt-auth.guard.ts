import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt') {
    constructor() {
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
                const { userId }  = jwtService.decode(token);
                const providedId = request?.body?.userId;
                if (providedId === userId) {
                    return true;
                } else {
                    response.clearCookie('Authentication').status(401).json({ msg: 'Invalid token' });
                }
            } else {
                response.clearCookie('Authentication').status(401).json({ msg: 'Invalid token' });
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
