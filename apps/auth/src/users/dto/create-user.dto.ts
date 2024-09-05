import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        {
            message:
                'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.'
        }
    )
    @IsOptional()
    password?: string;
}
