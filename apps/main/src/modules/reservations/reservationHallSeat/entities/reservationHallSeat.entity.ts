import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Reservation } from '../../entities/reservation.entity';
import { Session } from '../../../sessions/entities/session.entity';
import { HallSeat } from '../../../hall/hallSeat/entities/hallSeat.entity';
import { AbstractEntity } from '@app/common';

@Entity()
export class ReservationHallSeat extends AbstractEntity<ReservationHallSeat> {
    @ManyToOne(() => Reservation, (reservation) => reservation.reservationHallSeats)
    reservation: Reservation;

    @ManyToOne(() => HallSeat, (hallSeat) => hallSeat.reservationHallSeats)
    hallSeat: HallSeat;

    @ManyToOne(() => Session, (session) => session.reservationHallSeats)
    session: Session;

    @Column()
    reserved: boolean;
}
