import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { HallService } from '../hall/hall.service';
import { MoviesService } from '../movies/movies.service';
import { CinemaService } from '../cinemas/cinema.service';
import { Session } from './entities/session.entity';
import { SessionsRepository } from './session.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class SessionService {
    constructor(
        private readonly movieService: MoviesService,
        private readonly hallService: HallService,
        private readonly cinemaService: CinemaService,
        private readonly sessionsRepository: SessionsRepository
    ) {}

    @Transactional()
    async create(createSessionDto: CreateSessionDto) {
        const cinema = await this.cinemaService.findOne(createSessionDto.cinema);
        const hall = await this.hallService.findOne(createSessionDto.hall);
        const movie = await this.movieService.findOneByTitle(createSessionDto.movie);
        if (hall.cinema.name !== cinema.name) {
            throw new Error('No such hall in cinema');
        }
        const session = new Session({
            date: createSessionDto.date,
            time: createSessionDto.time,
            ticket_price: createSessionDto.ticket_price,
            cinema,
            hall,
            movie
        });
        return this.sessionsRepository.create(session);
    }

    findAll() {
        return this.sessionsRepository.find({});
    }
}
