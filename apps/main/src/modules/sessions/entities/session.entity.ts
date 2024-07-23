import { Entity, Column, ManyToOne } from 'typeorm';
import { Cinema } from '../../cinemas/entities/cinema.entity';
import { Hall } from '../../hall/entities/hall.entity';
import { AbstractEntity } from '@app/common';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Session extends AbstractEntity<Session> {
    @ManyToOne(() => Movie, (movie) => movie.sessions)
    movie: Movie;

    @Column('date')
    date: string;

    @Column('time')
    time: string;

    @Column()
    ticket_price: number;

    @ManyToOne(() => Cinema, (cinema) => cinema.sessions)
    cinema: Cinema;

    @ManyToOne(() => Hall, (hall) => hall.sessions)
    hall: Hall;
}
