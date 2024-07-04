import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { transformUserToResponseUserDto } from './users.mapper';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: User): Promise<UserResponseDto> {
        return transformUserToResponseUserDto(user);
    }
}
