import { Injectable } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';
import { Movie } from './entities/movie.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { MovieDetails } from './types/movie';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { generateWhere } from './utils/generateWhere';
import { GetPaginatedMoviesQueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository
  ) {}

  create(movieData: MovieDetails): Promise<Movie> {
    const movie = new Movie(movieData);
    return this.moviesRepository.create(movie);
  }

  findAllPaginated(options: IPaginationOptions, params: GetPaginatedMoviesQueryParamsDto): Promise<Pagination<Movie>> {
    const where = generateWhere(params);
    return this.moviesRepository.paginate(options, { where });
  }

  find(where: FindOptionsWhere<Movie>): Promise<Movie[]> {
    return this.moviesRepository.find(where)
  }

  findOne(id: string) {
    return this.moviesRepository.findOne({ id });
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.moviesRepository.findOneAndUpdate({ id }, updateMovieDto);
  }

  remove(id: string) {
    return this.moviesRepository.findOneAndDelete({ id });
  }
}
