import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Query, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from '@app/common/uploader/uploader.service';
import { Pagination } from '@app/common/pagination';
import { BaseController } from '@app/common/base/base.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { plainToInstance } from 'class-transformer';
import { TrendedMovieResponseDto } from './dto/trended-movie-response.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { GetPaginatedMoviesQueryParamsDto } from './dto/query-params.dto';
import { Request } from 'express';

@Controller('movies')
export class MoviesController extends BaseController {
  constructor(private readonly moviesService: MoviesService, private readonly uploaderService: UploaderService) {
    super()
  }

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
  async getPaginatedMovies(
    @Query() { page, limit, releaseType, title, genre }: GetPaginatedMoviesQueryParamsDto,
    @Req() request: Request
  ): Promise<Pagination<MovieResponseDto>> {
    const url = this.getUrl(request);

    const result = await this.moviesService.findAllPaginated({
      page,
      limit,
      route: url,
    }, { releaseType, title, genre });

    const mappedResponse: Pagination<MovieResponseDto> = {
      ...result,
      items: plainToInstance(MovieResponseDto, result.items)
    };

    return mappedResponse;
  }

  @Get('trended')
  async getTrendedMovies(): Promise<TrendedMovieResponseDto[]> {
    const movies = await this.moviesService.find({ trended: true });
    return plainToInstance(TrendedMovieResponseDto, movies);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id, ['sessions', 'sessions.cinema.city']);
  }
}
