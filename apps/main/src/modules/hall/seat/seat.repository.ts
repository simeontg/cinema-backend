import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';

@Injectable()
export class SeatRepository extends AbstractRepository<Seat> {
    protected readonly logger = new Logger(Seat.name);

    constructor(
        @InjectRepository(Seat)
        seatRepository: Repository<Seat>,
        entityManager: EntityManager
    ) {
        super(seatRepository, entityManager);
    }
}
