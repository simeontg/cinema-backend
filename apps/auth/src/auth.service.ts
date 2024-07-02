import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { Profile } from './profiles/entities/profile.entity';
import { CreateUserDto } from './users/dto/createUserDto';
import { CreateProfileDto } from './profiles/dto/createProfileDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService
  ) {}

  async registerUserProfile(createUserDto: CreateUserDto, createProfileDto: CreateProfileDto) {
    const profile = new Profile(createProfileDto);
    return await this.usersService.create(createUserDto, profile);
  }
}
