import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileRepository extends AbstractRepository<Profile> {
    protected readonly logger = new Logger(ProfileRepository.name);

    constructor(
        @InjectRepository(Profile)
        profilesRepository: Repository<Profile>,
        entityManager: EntityManager
    ) {
        super(profilesRepository, entityManager);
    }
}
