import { FindOptionsWhere, LessThanOrEqual, MoreThan, W } from 'typeorm';
import { GetPaginatedMoviesQueryParamsDto } from '../dto/query-params.dto';
import { Movie } from '../entities/movie.entity';

export const generateWhere = (
  params: GetPaginatedMoviesQueryParamsDto
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
