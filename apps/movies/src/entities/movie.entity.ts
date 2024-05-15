import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
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

    @Column()
    trending: boolean;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
