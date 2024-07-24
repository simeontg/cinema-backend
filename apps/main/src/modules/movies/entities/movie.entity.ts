import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';

@Entity({
    name: 'movies'
})
export class Movie extends AbstractEntity<Movie> {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    duration: number;

    @Column()
    imageUrl: string;

    @Column()
    genre: string;

    @Column()
    releaseDate: Date;

    @Column({
        default: false
    })
    trended: boolean;

    @OneToMany(() => Session, (session) => session.movie)
    sessions: Session[];
}
