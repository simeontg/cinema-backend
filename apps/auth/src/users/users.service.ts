import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUserDto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository, private readonly rolesService: RolesService) {}
    async create(createUserDto: CreateUserDto, profile: Profile) {
        const isEmailTaken = await this.usersRepository.findOne({ email: createUserDto.email });

        if (isEmailTaken) {
            throw new UnauthorizedException('Email is already taken');
        }

        const user = new User({
            email: createUserDto.email,
            password: await bcrypt.hash(createUserDto.password, 10)
        });

        const userRole = await this.rolesService.findOne({name: 'USER'})

        user.role = userRole;
        user.profile = profile;

        return this.usersRepository.create(user);
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid.');
        }

        return user;
    }
}
