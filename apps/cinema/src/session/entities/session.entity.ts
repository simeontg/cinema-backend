import { Entity, Column, ManyToOne } from 'typeorm';
import { Cinema } from '../../entities/cinema.entity';
import { Hall } from '../../hall/entities/hall.entity';
import { AbstractEntity } from '@app/common';

@Entity()
export class Session extends AbstractEntity<Session> {
    @Column()
    movie_id: string;

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
