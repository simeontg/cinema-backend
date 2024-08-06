import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationRepository extends AbstractRepository<Reservation> {
    protected readonly logger = new Logger(ReservationRepository.name);

    constructor(
        @InjectRepository(Reservation)
        reservationsRepository: Repository<Reservation>,
        entityManager: EntityManager
    ) {
        super(reservationsRepository, entityManager);
    }
}
