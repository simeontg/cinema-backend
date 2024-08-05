import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { ExtendedReservationDto } from './dto/extended-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { SessionService } from '../sessions/session.service';
import { RESERVATION_EXPIRATION_TIME } from './constants';
import { ReservationStatusService } from '../reservation_status/reservation-status.service';
import { ReservationStatuses } from '../reservation_status/types/reservation-status.enum';
import { ReservationRepository } from './reservations.repository';

@Injectable()
export class ReservationService {
    constructor(
        private readonly sessionService: SessionService,
        private readonly reservationStatusService: ReservationStatusService,
        private readonly reservationRepository: ReservationRepository
    ) {}

    @Transactional()
    async create(extendedReservationDto: ExtendedReservationDto) {
        const session = await this.sessionService.findOne(extendedReservationDto.sessionId);
        const status = await this.reservationStatusService.findOne({ status: ReservationStatuses.Pending });
        const now = new Date();
        const reservation = new Reservation({
            total_price: extendedReservationDto.total_price,
            profile_id: extendedReservationDto.profileId,
            session: session,
            date: now,
            expires_at: new Date(now.getTime() + RESERVATION_EXPIRATION_TIME),
            reservation_status: status
        });
        return this.reservationRepository.create(reservation);
    }
}
