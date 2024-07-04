import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileRepository } from './profiles.repository';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
    constructor(private readonly profileRepository: ProfileRepository) {}

    async create(createProfileDto: CreateProfileDto) {
        const profile = new Profile(createProfileDto);
        return this.profileRepository.create(profile);
    }
}
