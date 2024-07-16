import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    createToken(tokenPayload: TokenPayload) {
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));
        const token = this.jwtService.sign(tokenPayload);
        return { token, expires };
    }
}
