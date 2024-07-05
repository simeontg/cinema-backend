import { IntersectionType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateProfileDto } from '../profiles/dto/create-profile.dto';

export class RegisterUserProfileDto extends IntersectionType(CreateUserDto, CreateProfileDto) {}
