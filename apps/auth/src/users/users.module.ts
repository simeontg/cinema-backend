import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { ProfilesModule } from '../profiles/profiles.module';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([User]), ProfilesModule, RolesModule],
    providers: [UsersService, UsersRepository],
    exports: [UsersService]
})
export class UsersModule {}
