import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ReservationHallSeat } from './entities/reservationHallSeat.entity';

@Injectable()
export class ReservationHallSeatRepository extends AbstractRepository<ReservationHallSeat> {
    protected readonly logger = new Logger(ReservationHallSeat.name);

    constructor(
        @InjectRepository(ReservationHallSeat)
        reservationHallSeatRepository: Repository<ReservationHallSeat>,
        entityManager: EntityManager
    ) {
        super(reservationHallSeatRepository, entityManager);
    }
}
