import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsRepository extends AbstractRepository<Session> {
    protected readonly logger = new Logger(SessionsRepository.name);

    constructor(
        @InjectRepository(Session)
        reservationsRepository: Repository<Session>,
        entityManager: EntityManager
    ) {
        super(reservationsRepository, entityManager);
    }
}
