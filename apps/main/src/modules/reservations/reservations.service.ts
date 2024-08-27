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
import { FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ReservationHallSeatService } from './reservationHallSeat/reservationHallSeat.service';
import { ReservationGateway } from './reservations.gateway';

@Injectable()
export class ReservationService {
    constructor(
        private readonly sessionService: SessionService,
        private readonly reservationStatusService: ReservationStatusService,
        private readonly reservationRepository: ReservationRepository,
        private readonly reservationHallSeatService: ReservationHallSeatService,
        private readonly reservationGateway: ReservationGateway,
        @InjectQueue('reservation') private reservationQueue: Queue
    ) {}

    @Transactional()
    async create(extendedReservationDto: ExtendedReservationDto) {
        const session = await this.sessionService.findOne(extendedReservationDto.sessionId);
        const status = await this.reservationStatusService.findOne({
            status: ReservationStatuses.Pending
        });
        try {
            const existingReservation = await this.findOne(
                {
                    session: { id: session.id },
                    reservation_status: { id: status.id },
                    profile_id: extendedReservationDto.profileId
                },
                ['session']
            );
            return existingReservation;
        } catch (err) {
            const now = new Date();
            const reservation = new Reservation({
                total_price: extendedReservationDto.total_price,
                profile_id: extendedReservationDto.profileId,
                session: session,
                date: now,
                expires_at: new Date(now.getTime() + RESERVATION_EXPIRATION_TIME),
                reservation_status: status
            });
            const savedReservation = await this.reservationRepository.create(reservation);
            const { id } = savedReservation;
            await this.reservationQueue.add(
                'expire',
                { id },
                { delay: RESERVATION_EXPIRATION_TIME }
            );
            return this.findOne({ id: savedReservation.id }, ['session']);
        }
    }

    @Transactional()
    async update(id: string, updateReservationDto: UpdateReservationDto) {
        const status = await this.reservationStatusService.findOne({
            status: ReservationStatuses.Confirmed
        });

        const updatedReservation = await this.reservationRepository.findOneAndUpdate(
            { id },
            { total_price: updateReservationDto.total_price, reservation_status: status },
            ['session']
        );

        for (let hallSeat of updateReservationDto.hallSeats) {
            await this.reservationHallSeatService.create({
                reservation: updatedReservation,
                hallSeatId: hallSeat.id,
                session: updatedReservation.session,
                location: hallSeat.location
            });
        }
        this.reservationGateway.emitReservation(updatedReservation.session.id);
        return updatedReservation;
    }

    findOne(where: FindOptionsWhere<Reservation>, relations?: string[]) {
        return this.reservationRepository.findOne(where, relations);
    }

    async getUserReservations(profileId: string, expired: boolean) {
        const now = new Date();
        const confirmedStatus = await this.reservationStatusService.findOne({
            status: ReservationStatuses.Confirmed
        });
        return this.reservationRepository.findMany({
            where: {
                reservation_status: { id: confirmedStatus.id },
                profile_id: profileId,
                session: { date: expired ? LessThanOrEqual(now.toISOString().split('T')[0]) : MoreThanOrEqual(now.toISOString().split('T')[0]) }
            },
            relations: [
                'session',
                'session.movie',
                'reservationHallSeats',
            ],
            order: {
                updatedAt: 'DESC'
            }
        });
    }

    async deleteIfExpired(id: string) {
        const reservation = await this.reservationRepository.findOne({ id });
        if (reservation.reservation_status.status === ReservationStatuses.Pending) {
            await this.reservationRepository.findOneAndDelete({ id });
        }
    }
}
