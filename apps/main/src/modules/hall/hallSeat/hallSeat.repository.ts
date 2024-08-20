import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { HallSeat } from './entities/hallSeat.entity';

@Injectable()
export class HallSeatRepository extends AbstractRepository<HallSeat> {
    protected readonly logger = new Logger(HallSeat.name);

    constructor(
        @InjectRepository(HallSeat)
        hallSeatRepository: Repository<HallSeat>,
        entityManager: EntityManager
    ) {
        super(hallSeatRepository, entityManager);
    }
}
