import { Injectable } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';
import { Movie } from './entities/movie.entity';
import { FindOptionsWhere } from 'typeorm';
import { MovieDetails, MovieSearchParams } from './types/movie';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { generateWhere } from './utils/generateWhere';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository
  ) {}

  create(movieData: MovieDetails): Promise<Movie> {
    const movie = new Movie(movieData);
    return this.moviesRepository.create(movie);
  }

  findAllPaginated(options: IPaginationOptions, params: MovieSearchParams): Promise<Pagination<Movie>> {
    const where = generateWhere(params);
    return this.moviesRepository.paginate(options, { where });
  }

  find(where: FindOptionsWhere<Movie>): Promise<Movie[]> {
    return this.moviesRepository.find(where)
  }

  findOne(id: string, relations?: string[]) {
    return this.moviesRepository.findOne({ id }, relations);
  }

  findOneByTitle(title: string) {
    return this.moviesRepository.findOne({ title });
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.moviesRepository.findOneAndUpdate({ id }, updateMovieDto);
  }

  remove(id: string) {
    return this.moviesRepository.findOneAndDelete({ id });
  }
}
