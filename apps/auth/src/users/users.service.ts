import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUserDto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { Profile } from '../profiles/entities/profile.entity';
import { Roles } from '../roles/types/roles.enum';
import { Transactional } from 'typeorm-transactional';
import { GetUserDto } from './dto/getUserDto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/userResponseDto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository, private readonly rolesService: RolesService) {}
    
    @Transactional()
    async create(createUserDto: CreateUserDto, profile: Profile): Promise<User> {
        await this.validateCreateUserDto(createUserDto);

        const user = new User({
            email: createUserDto.email,
            password: await bcrypt.hash(createUserDto.password, 10)
        });

        const userRole = await this.rolesService.findOne({name: Roles.User})

        user.role = userRole;
        user.profile = profile;

        return this.usersRepository.create(user);
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({ email: createUserDto.email});
        } catch (err) {
            return;
        }

        throw new UnprocessableEntityException('Email already exists');
    }

    async verifyUser(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid.');
        }

        return user;
    }

    async getUser(getUserDto: GetUserDto): Promise<User> {
        return this.usersRepository.findOne(getUserDto);
    }

    async transformUserToResponseUserDto(user: User) {
        const { id, email, profile: { firstName, lastName }, role: { name: role } } = user;

        return plainToInstance(UserResponseDto, {
            id,
            email,
            firstName,
            lastName,
            role
        });
    }
}