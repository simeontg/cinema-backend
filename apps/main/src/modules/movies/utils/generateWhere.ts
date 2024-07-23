import { FindOptionsWhere, LessThanOrEqual, MoreThan, W } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { MovieSearchParams } from '../types/movie';

export const generateWhere = (
  params: MovieSearchParams
): FindOptionsWhere<Movie> => {
  const where: FindOptionsWhere<Movie> = {};
  const currentDate = new Date();

  if (params.releaseType) {
    where.releaseDate =
      params.releaseType === 'current' ? LessThanOrEqual(currentDate) : MoreThan(currentDate);
  }

  if (params.title) {
    where.title = params.title;
  }

  if (params.genre) {
    where.genre = params.genre;
  }

  return where;
};
