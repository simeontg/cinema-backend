import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { Profile } from './profiles/entities/profile.entity';
import { CreateUserDto } from './users/dto/create-user.dto';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { User } from './users/entities/user.entity';
import { Response } from 'express';
import { TokenService, TokenPayload } from '@app/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
    ) {}

    async registerUserProfile(createUserDto: CreateUserDto, createProfileDto: CreateProfileDto) {
        const profile = new Profile(createProfileDto);
        return await this.usersService.create(createUserDto, profile);
    }

    async getOrRegisterUserProfile(createUserDto: CreateUserDto, createProfileDto: CreateProfileDto) {
        let user: User;

        try {
            const createdUser = await this.registerUserProfile(
                { email: createUserDto.email },
                { firstName: createProfileDto.firstName, lastName: createProfileDto.lastName }
            );
            user = createdUser;
        } catch (err) {
            user = await this.usersService.getUserByEmail({ email: createUserDto.email });
        }
 
        return user;
    }

    async login(user: User, response: Response) {
        const tokenPayload: TokenPayload = {
            userId: user.id
        };

        const { token, expires } = this.tokenService.createToken(tokenPayload);

        response.cookie('Authentication', token, {
            httpOnly: true,
            expires,
        });
    }
    
    async getNewToken(userId: string, response: Response) {
        const tokenPayload: TokenPayload = {
            userId
        };

        const { token, expires } = this.tokenService.createToken(tokenPayload);

        response.cookie('Authentication', token, {
            httpOnly: true,
            expires
        });
    }

    signOut(res: Response) {
        res.clearCookie('Authentication');
    }
}
