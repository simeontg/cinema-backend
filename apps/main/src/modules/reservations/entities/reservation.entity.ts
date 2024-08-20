import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { ReservationStatus } from '../reservationStatus/entities/reservation-status.entity';
import { ReservationHallSeat } from '../reservationHallSeat/entities/reservationHallSeat.entity';

@Entity({
    name: 'reservations'
})
export class Reservation extends AbstractEntity<Reservation> {
    @ManyToOne(() => Session, { eager: true })
    @JoinColumn({ name: 'session_id' })
    session: Session;

    @Column()
    profile_id: string;

    @Column()
    date: Date;

    @Column()
    total_price: number;

    @Column()
    expires_at: Date;

    @ManyToOne(() => ReservationStatus, { eager: true })
    @JoinColumn({ name: 'reservation_status_id' })
    reservation_status: ReservationStatus;

    @OneToMany(
        () => ReservationHallSeat,
        (reservationHallSeat) => reservationHallSeat.reservation
    )
    reservationHallSeats: ReservationHallSeat[];
}
