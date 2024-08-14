import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { ExtendedReservationDto } from './dto/extended-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { SessionService } from '../sessions/session.service';
import { RESERVATION_EXPIRATION_TIME } from './constants';
import { ReservationStatusService } from './reservationStatus/reservationStatus.service';
import { ReservationStatuses } from './reservationStatus/types/reservation-status.enum';
import { ReservationRepository } from './reservations.repository';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReservationService {
    constructor(
        private readonly sessionService: SessionService,
        private readonly reservationStatusService: ReservationStatusService,
        private readonly reservationRepository: ReservationRepository,
        @InjectQueue('reservation') private reservationQueue: Queue
    ) {}

    @Transactional()
    async create(extendedReservationDto: ExtendedReservationDto) {
        const session = await this.sessionService.findOne(extendedReservationDto.sessionId);
        const status = await this.reservationStatusService.findOne({
            status: ReservationStatuses.Pending
        });
        const now = new Date();
        const reservation = new Reservation({
            total_price: extendedReservationDto.total_price,
            profile_id: extendedReservationDto.profileId,
            session: session,
            date: now,
            expires_at: new Date(now.getTime() + RESERVATION_EXPIRATION_TIME),
            reservation_status: status
        });
        const savedResevation = await this.reservationRepository.create(reservation);
        const { id } = savedResevation;
        await this.reservationQueue.add('expire', { id }, { delay: RESERVATION_EXPIRATION_TIME });
        return savedResevation;
    }

    async update(id: string, updateReservationDto: UpdateReservationDto) {
        return this.reservationRepository.findOneAndUpdate({ id }, updateReservationDto);
    }

    async deleteIfExpired(id: string) {
        const reservation = await this.reservationRepository.findOne({ id });
        if (reservation.reservation_status.status === ReservationStatuses.Pending) {
            await this.reservationRepository.findOneAndDelete({ id });
        }
    }
}
