import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserProfileDto } from './dto/register-user-profile.dto';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users/entities/user.entity';
import { UsersMapper } from './users/users.mapper';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersMapper: UsersMapper,
        private readonly configService: ConfigService,
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

    @Post('getToken')
    async getToken(userId: string, @Res({ passthrough: true }) response: Response) {
        await this.authService.getNewToken(userId, response);
    }

    @UseGuards(JwtAuthGuard)
    @Post('signout')
    signOut(@Res() res: Response) {
        this.authService.signOut(res);
        return res.status(201).json({ msg: 'Signed out successfully!' });
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    handleGoogleLogin() {
        return true;
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async handleGoogleRedirect(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const { email, firstName, lastName } = request.user as RegisterUserProfileDto;

        try {
            const user = await this.authService.getOrRegisterUserProfile(
                { email },
                { firstName, lastName }
            );
            await this.authService.login(user, response);
            response.redirect(this.configService.get('CLIENT_APP_URL'));
        } catch (err) {
            return response
                .status(500)
                .json({ msg: 'Something went wrong. Please try again later.' });
        }
    }
}
