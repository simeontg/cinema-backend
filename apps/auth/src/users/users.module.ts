import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule, TokenModule } from '@app/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { ProfilesModule } from '../profiles/profiles.module';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([User]), ProfilesModule, RolesModule, TokenModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, UsersMapper],
    exports: [UsersService, UsersMapper]
})
export class UsersModule {}
