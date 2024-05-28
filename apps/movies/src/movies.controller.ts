import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, ParseIntPipe, DefaultValuePipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploaderService } from '@app/common/uploader/uploader.service';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { plainToInstance } from 'class-transformer';
import { TrendedMovieResponseDto } from './dto/trended-movie-response.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { PaginationMetaDto } from './dto/pagination-meta.dto';
import { PaginationLinksDto } from './dto/pagination-links.dto';

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
  async getPaginatedMovies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20
  ): Promise<PaginationResponseDto<MovieResponseDto[]>> {
    limit = limit > 100 ? 100 : limit;

    const result = await this.moviesService.findAll({
      page,
      limit,
      route: 'http://localhost:3001/movies',
    });

    const response = {
      links: plainToInstance(PaginationLinksDto, result.links), 
      items: plainToInstance(MovieResponseDto, result.items), 
      meta: plainToInstance(PaginationMetaDto, result.meta)
    };

    return plainToInstance(PaginationResponseDto<MovieResponseDto[]>, response);
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
