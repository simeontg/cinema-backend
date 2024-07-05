import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserProfileDto } from './dto/register-user-profile.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users/entities/user.entity';
import { UsersMapper } from './users/users.mapper';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersMapper: UsersMapper
    ) {}

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserProfileDto, @Res() res: Response) {
        const userData = { email: registerUserDto.email, password: registerUserDto.password };
        const profileData = {
            firstName: registerUserDto.firstName,
            lastName: registerUserDto.lastName,
            phoneNumber: registerUserDto.phoneNumber
        };
        await this.authService.registerUserProfile(userData, profileData);
        return res.status(201).json({ msg: 'User created!' });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
        await this.authService.login(user, response);
        const userData = await this.usersMapper.transformUserToResponseUserDto(user);
        response.send(userData);
    }
}
