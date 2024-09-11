import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Hall } from '../../hall/entities/hall.entity';
import { City } from '../../city/entities/city.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity({
    name: 'cinemas'
})
export class Cinema extends AbstractEntity<Cinema> {
    @Column()
    name: string;

    @OneToMany(() => Hall, (hall) => hall.cinema, { cascade: ['remove'] })
    halls: Hall[];

    @OneToMany(() => Session, (session) => session.cinema, { cascade: ['remove'] })
    sessions: Session[];

    @ManyToOne(() => City, (city) => city.cinemas, {
        eager: true
    })
    @JoinColumn()
    city: City;
}
