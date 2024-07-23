import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersMapper } from './users.mapper';
import { CurrentUser } from '@app/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersMapper: UsersMapper) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: User): Promise<UserResponseDto> {
        return this.usersMapper.transformUserToResponseUserDto(user);
    }
}
