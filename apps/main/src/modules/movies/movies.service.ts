import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';
import { Movie } from './entities/movie.entity';
import { FindOptionsWhere } from 'typeorm';
import { MovieDetails, MovieSearchParams } from './types/movie';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { generateWhere } from './utils/generateWhere';
import { UploaderService } from '@app/common/uploader/uploader.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
    constructor(
        private readonly moviesRepository: MoviesRepository,
        private readonly uploaderService: UploaderService
    ) {}

    async create(createMovieDto: CreateMovieDto, image: Express.Multer.File): Promise<Movie> {
        const imageUrl = await this.uploaderService.upload(image.originalname, image.buffer);
        const movieData: MovieDetails = {
            title: createMovieDto.title,
            description: createMovieDto.description,
            genre: createMovieDto.genre,
            duration: +createMovieDto.duration,
            releaseDate: createMovieDto.releaseDate,
            trended: createMovieDto.trended,
            imageUrl
        };

        const movieWithSameTitle = await this.moviesRepository.findOne({ title: movieData.title });

        if (movieWithSameTitle) { 
            throw new BadRequestException('Movie with same name already exists');
        }
    
        const movie = new Movie(movieData);
        return this.moviesRepository.create(movie);
    }

    async update(
        id: string,
        updateMovieDto: UpdateMovieDto,
        image: Express.Multer.File
    ): Promise<Movie> {
        const existingMovie = await this.moviesRepository.findOne({ id });

        let imageUrl = existingMovie.imageUrl;

        if (image) {
            await this.uploaderService.delete(existingMovie.imageUrl);
            imageUrl = await this.uploaderService.upload(image.originalname, image.buffer);
        }

        const updateData: MovieDetails = {
            title: updateMovieDto.title,
            description: updateMovieDto.description,
            genre: updateMovieDto.genre,
            duration: +updateMovieDto.duration,
            releaseDate: updateMovieDto.releaseDate,
            trended: updateMovieDto.trended,
            imageUrl
        };

        return this.moviesRepository.findOneAndUpdate({ id }, updateData);
    }

    findAllPaginated(
        options: IPaginationOptions,
        params: MovieSearchParams
    ): Promise<Pagination<Movie>> {
        const where = generateWhere(params);
        return this.moviesRepository.paginate(options, { where, relations: ['sessions'] });
    }

    find(where: FindOptionsWhere<Movie>): Promise<Movie[]> {
        return this.moviesRepository.find(where);
    }

    findOne(id: string, relations?: string[]) {
        return this.moviesRepository.findOne({ id }, relations);
    }

    findOneByTitle(title: string) {
        return this.moviesRepository.findOne({ title });
    }

    async remove(id: string) {
        const movie = await this.moviesRepository.findOne({ id });
        await this.uploaderService.delete(movie.imageUrl);
        return this.moviesRepository.findOneAndDelete({ id });
    }
}
