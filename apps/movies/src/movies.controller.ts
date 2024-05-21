import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from '@app/common/uploader/uploader.service';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { plainToInstance } from 'class-transformer';
import { TrendedMovieResponseDto } from './dto/trended-movie-response.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService, private readonly uploaderService: UploaderService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createMovieDto: CreateMovieDto, @UploadedFile() image: Express.Multer.File) {
    const imageUrl = await this.uploaderService.upload(image.originalname, image.buffer);
    const movie = {
      title: createMovieDto.title,
      description: createMovieDto.description,
      genre: createMovieDto.genre,
      duration: +createMovieDto.duration,
      releaseDate: createMovieDto.releaseDate,
      trended: createMovieDto.trended,
      imageUrl,    
    }
    return this.moviesService.create(movie);
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
