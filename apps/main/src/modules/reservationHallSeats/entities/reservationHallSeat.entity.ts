import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Session } from '../../sessions/entities/session.entity';
import { HallSeat } from '../../hall/entities/hall-seat.entity';

@Entity()
export class ReservationHallSeats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation, reservation => reservation.reservationHallSeats)
  reservation: Reservation;

  @ManyToOne(() => HallSeat, hallSeat => hallSeat.reservationHallSeats)
  hallSeat: HallSeat;

  @ManyToOne(() => Session, session => session.reservationHallSeats)
  session: Session;

  @Column()
  reserved: boolean;
}
