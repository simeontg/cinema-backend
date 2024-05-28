import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from '@app/common/uploader/uploader.service';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { plainToInstance } from 'class-transformer';
import { TrendedMovieResponseDto } from './dto/trended-movie-response.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService, private readonly uploaderService: UploaderService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createMovieDto: CreateMovieDto, @UploadedFile() image: Express.Multer.File): Promise<MovieResponseDto> {
    const imageUrl = await this.uploaderService.upload(image.originalname, image.buffer);
    const movie = await this.moviesService.create({
      title: createMovieDto.title,
      description: createMovieDto.description,
      genre: createMovieDto.genre,
      duration: +createMovieDto.duration,
      releaseDate: createMovieDto.releaseDate,
      trended: createMovieDto.trended,
      imageUrl,   
    });
    return plainToInstance(MovieResponseDto, movie);
  }

  @Get()
  async getPaginatedMovies(@Query() { offset, limit }: PaginationDto): Promise<PaginationResponseDto<MovieResponseDto>> {
    const [movies, totalCount] = await this.moviesService.findAndCount({skip: offset, take: limit});
    const moviesResponse = plainToInstance(MovieResponseDto, movies);
    return plainToInstance(PaginationResponseDto<MovieResponseDto>, { data: moviesResponse, totalCount, offset, limit });
  }

  @Get('trended')
  async getTrendedMovies(): Promise<TrendedMovieResponseDto[]> {
    const movies = await this.moviesService.find({ trended: true });
    return plainToInstance(TrendedMovieResponseDto, movies);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }
}
