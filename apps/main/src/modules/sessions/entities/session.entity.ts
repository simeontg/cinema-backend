import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Cinema } from '../../cinemas/entities/cinema.entity';
import { Hall } from '../../hall/entities/hall.entity';
import { AbstractEntity } from '@app/common';
import { Movie } from '../../movies/entities/movie.entity';
import { ReservationHallSeat } from '../../reservations/reservationHallSeat/entities/reservationHallSeat.entity';
import { SessionHallSeat } from '../sessionHallSeat/entities/sessionHallSeat.entity';

@Entity()
export class Session extends AbstractEntity<Session> {
    @ManyToOne(() => Movie, (movie) => movie.sessions)
    movie: Movie;

    @Column('date')
    date: string;

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @ManyToOne(() => Cinema, (cinema) => cinema.sessions, {
        eager: true
    })
    cinema: Cinema;

    @ManyToOne(() => Hall, (hall) => hall.sessions, { eager: true })
    hall: Hall;

    @OneToMany(() => ReservationHallSeat, (reservationHallSeat) => reservationHallSeat.session, { cascade: ['remove'] })
    reservationHallSeats: ReservationHallSeat[];

    @OneToMany(() => SessionHallSeat, (sessionHallSeat) => sessionHallSeat.session, { cascade: ['remove'] })
    sessionHallSeats: SessionHallSeat[];
}
