import { Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Hall } from '../../entities/hall.entity';
import { Seat } from '../../entities/seat.entity';
import { ReservationHallSeat } from '../../../reservations/reservationHallSeat/entities/reservationHallSeat.entity';

@Entity()
export class HallSeat extends AbstractEntity<HallSeat> {
    @ManyToOne(() => Hall)
    @JoinColumn({ name: 'hall_id' })
    hall: Hall;

    @ManyToOne(() => Seat, null, { eager: true })
    @JoinColumn({ name: 'seat_id' })
    seat: Seat;

    @OneToMany(() => ReservationHallSeat, (reservationHallSeat) => reservationHallSeat.hallSeat)
    reservationHallSeats?: ReservationHallSeat[];
}