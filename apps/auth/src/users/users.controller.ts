import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../current-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserResponseDto } from './dto/userResponseDto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(
        @CurrentUser() user: User
    ): Promise<UserResponseDto> {
        return this.usersService.transformUserToResponseUserDto(user);
    }
}
