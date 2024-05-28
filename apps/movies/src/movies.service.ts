import { Injectable } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';
import { Movie } from './entities/movie.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MovieDetails } from './types/movie';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository
  ) {}

  create(movieData: MovieDetails): Promise<Movie> {
    const movie = new Movie(movieData);
    return this.moviesRepository.create(movie);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Movie>> {
    return this.moviesRepository.paginate(options);
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
