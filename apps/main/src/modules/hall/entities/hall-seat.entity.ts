import { Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Hall } from './hall.entity';
import { Seat } from './seat.entity';
import { ReservationHallSeats } from '../../reservationHallSeats/entities/reservationHallSeat.entity';

@Entity()
export class HallSeat extends AbstractEntity<HallSeat> {
    @ManyToOne(() => Hall)
    @JoinColumn({ name: 'hall_id' })
    hall: Hall;
  
    @ManyToOne(() => Seat)
    @JoinColumn({ name: 'seat_id' })
    seat: Seat;

    @OneToMany(() => ReservationHallSeats, reservationHallSeats => reservationHallSeats.hallSeat)
    reservationHallSeats: ReservationHallSeats[];
}
