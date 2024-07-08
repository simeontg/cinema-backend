import { IsEmail, IsOptional, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    @IsOptional()
    password?: string;
}