import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { HealthModule, LoggerModule } from '@app/common';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [UsersModule, ProfilesModule, LoggerModule, HealthModule, RolesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
