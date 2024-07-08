import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { Profile } from './profiles/entities/profile.entity';
import { CreateUserDto } from './users/dto/create-user.dto';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { User } from './users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    async registerUserProfile(createUserDto: CreateUserDto, createProfileDto: CreateProfileDto) {
        const profile = new Profile(createProfileDto);
        return await this.usersService.create(createUserDto, profile);
    }

    async login(user: User, response: Response) {
        const tokenPayload: TokenPayload = {
            userId: user.id
        };

        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

        const token = this.jwtService.sign(tokenPayload);

        response.cookie('Authentication', token, {
            httpOnly: true,
            expires
        });
    }

    signOut(res: Response) {
        res.clearCookie('Authentication');
    }
}
