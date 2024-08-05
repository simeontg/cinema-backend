import { Entity, Column, OneToMany} from 'typeorm';
import { AbstractEntity } from '@app/common';
import { HallSeat } from './hall-seat.entity';

@Entity()
export class Seat extends AbstractEntity<Seat> {
    @Column()
    seat_type: string;

    @Column()
    price: number;

    @OneToMany(() => HallSeat, hallSeat => hallSeat.seat)
    hallSeats: HallSeat[];
}
