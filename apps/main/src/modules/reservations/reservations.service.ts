import { Inject, Injectable } from '@nestjs/common';
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
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '@app/common/dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReservationService {
    constructor(
        private readonly sessionService: SessionService,
        private readonly reservationStatusService: ReservationStatusService,
        private readonly reservationRepository: ReservationRepository,
        private readonly reservationHallSeatService: ReservationHallSeatService,
        private readonly reservationGateway: ReservationGateway,
        private readonly configService: ConfigService,
        @InjectQueue('reservation') private reservationQueue: Queue,
        @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
    ) {}

    @Transactional()
    async create(extendedReservationDto: ExtendedReservationDto) {
        const session = await this.sessionService.findOne(extendedReservationDto.sessionId);
        const status = await this.reservationStatusService.findOne({
            status: ReservationStatuses.Pending
        });
        const existingReservation = await this.findOne(
            {
                session: { id: session.id },
                reservation_status: { id: status.id },
                profile_id: extendedReservationDto.profileId
            },
            ['session']
        );

        if (existingReservation) {
            return existingReservation;
        }

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
        await this.reservationQueue.add('expire', { id }, { delay: RESERVATION_EXPIRATION_TIME });
        return this.findOne({ id: savedReservation.id }, ['session']);
    }

    @Transactional()
    async update(user: UserDto, reservationId: string, updateReservationDto: UpdateReservationDto) {
        const status = await this.reservationStatusService.findOne({
            status: ReservationStatuses.Confirmed
        });

        const updatedReservation = await this.reservationRepository.findOneAndUpdate(
            { id: reservationId },
            { total_price: updateReservationDto.total_price, reservation_status: status },
            ['session', 'session.movie', 'session.hall', 'session.cinema']
        );

        const hallSeatLocations = []

        for (let hallSeat of updateReservationDto.hallSeats) {
            await this.reservationHallSeatService.create({
                reservation: updatedReservation,
                hallSeatId: hallSeat.id,
                session: updatedReservation.session,
                location: hallSeat.location
            });

            hallSeatLocations.push(hallSeat.location);
        }
        this.reservationGateway.emitReservation(updatedReservation.session.id);

        const emailData = this.generateEmailContent(user, updatedReservation, hallSeatLocations);

        this.notificationsService.emit('notify_email', {
            email: user.email,
            text: emailData.text,
            html: emailData.html,
            subject: 'Movie Reservation Success'
        });
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
                session: {
                    date: expired
                        ? LessThanOrEqual(now.toISOString().split('T')[0])
                        : MoreThanOrEqual(now.toISOString().split('T')[0])
                }
            },
            relations: ['session', 'session.movie', 'reservationHallSeats'],
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


    private generateEmailContent(user: UserDto, updatedReservation: Reservation, hallSeatLocations: string[]) {
        const clientAppUrl = this.configService.get('CLIENT_APP_URL');
        const reservationUrl = `${clientAppUrl}/profile`;

        const emailText = `
        Dear ${user.profile.firstName},
        Your reservation was successful!
        Total price: $${updatedReservation.total_price}
        `;

        const emailHtml = `<div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #6e3996; padding: 20px; text-align: center; color: #fff;">
                    <h2 style="margin: 0;">🎉 Reservation made for ${updatedReservation.session.movie.title} 🎉</h2>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px; color: #333;">Dear ${user.profile.firstName},</p>
                    <p style="font-size: 16px; color: #333;">
                        We're excited to inform you that your reservation has been made successfully!
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        <strong>Date:</strong> <span style="color: #6e3996; font-size: 18px;">${updatedReservation.session.date}</span>
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        <strong>Start time:</strong> <span style="color: #6e3996; font-size: 18px;">${updatedReservation.session.startTime}</span>
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        <strong>Venue:</strong> <span style="color: #6e3996; font-size: 18px;">${updatedReservation.session.cinema.name}, ${updatedReservation.session.hall.hall_name}</span>
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        <strong>Total Price:</strong> <span style="color: #6e3996; font-size: 18px;">$${updatedReservation.total_price}</span>
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        <strong>Seats reserved:</strong> <span style="color: #6e3996; font-size: 18px;">${hallSeatLocations.join(',')}</span>
                    </p>
                    <p style="font-size: 16px; color: #333;">We hope you enjoy your movie experience!</p>.
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${reservationUrl}" target="_blank" rel="noopener noreferrer" style="padding: 12px 20px; background-color: #6e3996; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">View Your Reservations</a>
                    </div>
                </div>
                <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #777;">
                    <p>If you did not make this reservation, please ignore this email.</p>
                    <p>© 2024 Simeon Cinemas. All rights reserved.</p>
                </div>
            </div>
        </div>`;

        return { text: emailText, html: emailHtml };
    }
}
