import { AbstractEntity } from '@app/common';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Hall } from '../hall/entities/hall.entity';
import { City } from '../city/entities/city.entity';
import { Session } from '../session/entities/session.entity';

@Entity({
    name: 'cinemas'
})
export class Cinema extends AbstractEntity<Cinema> {
    @Column()
    name: string;

    @OneToMany(() => Hall, (hall) => hall.cinema)
    halls: Hall[];

    @OneToMany(() => Session, (session) => session.cinema)
    sessions: Session[];

    @ManyToOne(() => City, (city) => city.cinemas)
    city: City;
}
