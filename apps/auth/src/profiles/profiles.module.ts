import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { ProfileRepository } from './profiles.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Profile])],
  providers: [ProfilesService, ProfileRepository],
  exports: [ProfilesService]
})
export class ProfilesModule {}
