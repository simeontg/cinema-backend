import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
  ) {}

  createToken(tokenPayload: TokenPayload) {
    const token = this.jwtService.sign(tokenPayload);
    return token;
  }
}
