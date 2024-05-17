import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { plainToInstance } from 'class-transformer';
import { TrendedMovieResponseDto } from './dto/trended-movie-response.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('trended')
  async getTrendedMovies(): Promise<TrendedMovieResponseDto[]> {
    const movies = await this.moviesService.find({ trended: true });
    return plainToInstance(TrendedMovieResponseDto, movies);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }
}
