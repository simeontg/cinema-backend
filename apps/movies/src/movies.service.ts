import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';
import { Movie } from './entities/movie.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class MoviesService {

  constructor(
    private readonly moviesRepository: MoviesRepository
  ) {}

  create(createMovieDto: CreateMovieDto) {
    const movie = new Movie({...createMovieDto, createdAt: new Date(), updatedAt: new Date()});
    return this.moviesRepository.create(movie);
  }

  findAll() {
    return this.moviesRepository.find({});
  }

  find(where: FindOptionsWhere<Movie>) {
    return this.moviesRepository.find(where)
  }

  findOne(id: number) {
    return this.moviesRepository.findOne({ id });
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.moviesRepository.findOneAndUpdate({ id }, updateMovieDto);
  }

  remove(id: number) {
    return this.moviesRepository.findOneAndDelete({ id });
  }
}
