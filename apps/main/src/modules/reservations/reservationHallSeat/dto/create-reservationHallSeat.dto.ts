import { IsNotEmpty, IsString } from 'class-validator';
import { Session } from '../../../sessions/entities/session.entity';
import { Reservation } from '../../entities/reservation.entity';

export class CreateReservationHallSeatDto {
    @IsNotEmpty()
    session: Session;

    @IsNotEmpty()
    reservation: Reservation;

    @IsNotEmpty()
    @IsString()
    hallSeatId: string;

    @IsNotEmpty()
    @IsString()
    location: string;
}
