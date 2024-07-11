import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { ProfilesModule } from '../profiles/profiles.module';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { AuthModule } from '../auth.module';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([User]), ProfilesModule, RolesModule, forwardRef(() => AuthModule)],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, UsersMapper],
    exports: [UsersService, UsersMapper]
})
export class UsersModule {}
