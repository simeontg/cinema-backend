import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

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
}
