import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersMapper {
    async transformUserToResponseUserDto(user: User) {
        const {
            id,
            email,
            profile: { firstName, lastName },
            role: { name: role }
        } = user;

        return plainToInstance(UserResponseDto, {
            id,
            email,
            firstName,
            lastName,
            role
        });
    }
}
