import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ReservationStatus } from './entities/reservation-status.entity';

@Injectable()
export class ReservationStatusRepository extends AbstractRepository<ReservationStatus> {
    protected readonly logger = new Logger(ReservationStatus.name);

    constructor(
        @InjectRepository(ReservationStatus)
        reservationsRepository: Repository<ReservationStatus>,
        entityManager: EntityManager
    ) {
        super(reservationsRepository, entityManager);
    }
}
