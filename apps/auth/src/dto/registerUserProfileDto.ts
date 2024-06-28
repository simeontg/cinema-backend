import { IntersectionType } from "@nestjs/mapped-types";
import { CreateUserDto } from "../users/dto/createUserDto";
import { CreateProfileDto } from "../profiles/dto/createProfileDto";

export class RegisterUserProfileDto extends IntersectionType(CreateUserDto, CreateProfileDto) {}
