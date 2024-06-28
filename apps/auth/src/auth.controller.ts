import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserProfileDto } from './dto/registerUserProfileDto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserProfileDto, @Res() res: Response) {
    const userData = { email: registerUserDto.email, password: registerUserDto.password };
    const profileData = { firstName: registerUserDto.firstName, lastName: registerUserDto.lastName, phoneNumber: registerUserDto.phoneNumber}
    await this.authService.registerUserProfile(userData, profileData);
    return res.status(201).json({ msg: 'User created!' });
  }

}
