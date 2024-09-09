import { FindOptionsWhere, LessThanOrEqual, MoreThan, MoreThanOrEqual, W } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { MovieSearchParams } from '../types/movie';

export const generateWhere = (params: MovieSearchParams): FindOptionsWhere<Movie> => {
    const where: FindOptionsWhere<Movie> = {};
    const currentDate = new Date();

    if (params.releaseType) {
        params.releaseType === 'current' &&
            ((where.sessions = {
                date: MoreThanOrEqual(currentDate.toISOString().split('T')[0])
            }),
            where.releaseDate = LessThanOrEqual(currentDate));
        params.releaseType === 'upcoming' && (where.releaseDate = MoreThan(currentDate));
    }

    if (params.title) {
        where.title = params.title;
    }

    if (params.genre) {
        where.genre = params.genre;
    }

    return where;
};
