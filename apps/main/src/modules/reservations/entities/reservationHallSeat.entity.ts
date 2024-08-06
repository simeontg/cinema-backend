import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Session } from '../../sessions/entities/session.entity';
import { HallSeat } from '../../hall/entities/hallSeat.entity';
import { AbstractEntity } from '@app/common';

@Entity()
export class ReservationHallSeats extends AbstractEntity<ReservationHallSeats> {
    @ManyToOne(() => Reservation, (reservation) => reservation.reservationHallSeats)
    reservation: Reservation;

    @ManyToOne(() => HallSeat, (hallSeat) => hallSeat.reservationHallSeats)
    hallSeat: HallSeat;

    @ManyToOne(() => Session, (session) => session.reservationHallSeats)
    session: Session;

    @Column()
    reserved: boolean;
}
