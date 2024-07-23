import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';

@Injectable()
export class CinemasRepository extends AbstractRepository<Cinema> {
    protected readonly logger = new Logger(CinemasRepository.name);

    constructor(
        @InjectRepository(Cinema)
        reservationsRepository: Repository<Cinema>,
        entityManager: EntityManager
    ) {
        super(reservationsRepository, entityManager);
    }
}
