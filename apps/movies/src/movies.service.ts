import { Injectable } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';
import { Movie } from './entities/movie.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { MovieDetails } from './types/movie';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository
  ) {}

  create(movieData: MovieDetails): Promise<Movie> {
    const movie = new Movie(movieData);
    return this.moviesRepository.create(movie);
  }

  findAll(options: FindManyOptions) {
    return this.moviesRepository.find(options);
  }

  findAndCount(options: FindManyOptions) {
    return this.moviesRepository.findAndCount(options);
  }

  find(where: FindOptionsWhere<Movie>): Promise<Movie[]> {
    return this.moviesRepository.findBy(where);
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
