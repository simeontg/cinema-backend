import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Hall } from './entities/hall.entity';

@Injectable()
export class HallsRepository extends AbstractRepository<Hall> {
    protected readonly logger = new Logger(HallsRepository.name);

    constructor(
        @InjectRepository(Hall)
        reservationsRepository: Repository<Hall>,
        entityManager: EntityManager
    ) {
        super(reservationsRepository, entityManager);
    }
}
