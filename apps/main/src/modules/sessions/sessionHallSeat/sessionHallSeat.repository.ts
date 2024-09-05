import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { SessionHallSeat } from './entities/sessionHallSeat.entity';

@Injectable()
export class SessionHallSeatRepository extends AbstractRepository<SessionHallSeat> {
    protected readonly logger = new Logger(SessionHallSeatRepository.name);

    constructor(
        @InjectRepository(SessionHallSeat)
        sessionHallSeatRepository: Repository<SessionHallSeat>,
        entityManager: EntityManager
    ) {
        super(sessionHallSeatRepository, entityManager);
    }
}
