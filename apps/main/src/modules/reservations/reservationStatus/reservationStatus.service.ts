import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { ReservationStatusRepository } from './reservationStatus.repository';
import { ReservationStatus } from './entities/reservation-status.entity';

@Injectable()
export class ReservationStatusService {
    constructor(private readonly reservationsStatusRepository: ReservationStatusRepository) {}

    async findOne(where: FindOptionsWhere<ReservationStatus>) {
        return this.reservationsStatusRepository.findOne(where);
    }
}
