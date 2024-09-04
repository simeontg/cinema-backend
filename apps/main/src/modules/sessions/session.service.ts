import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { HallService } from '../hall/hall.service';
import { MoviesService } from '../movies/movies.service';
import { CinemaService } from '../cinemas/cinema.service';
import { Session } from './entities/session.entity';
import { SessionsRepository } from './session.repository';
import { Transactional } from 'typeorm-transactional';
import { Between, FindOptionsWhere, Not } from 'typeorm';
import { UpdateSessionDto } from './dto/update-session.dto';
import * as moment from 'moment';

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
        const cinema = await this.cinemaService.findOne({ id: createSessionDto.cinema });
        const hall = await this.hallService.findOne({ id: createSessionDto.hall });
        const movie = await this.movieService.findOne(createSessionDto.movie);

        if (hall.cinema.name !== cinema.name) {
            throw new Error('No such hall in cinema');
        }

        const startTime = moment(
            `${createSessionDto.date} ${createSessionDto.time}`,
            'YYYY-MM-DD HH:mm'
        );
        const endTime = startTime.clone().add(movie.duration, 'minutes');
        const startTimeStr = startTime.format('HH:mm');
        const endTimeStr = endTime.format('HH:mm');

        const existingSession = await this.sessionsRepository.find([
            {
                cinema: { id: cinema.id },
                hall: { id: hall.id },
                date: createSessionDto.date,
                startTime: Between(startTimeStr, endTimeStr)
            },
            {
                cinema: { id: cinema.id },
                hall: { id: hall.id },
                date: createSessionDto.date,
                endTime: Between(startTimeStr, endTimeStr)
            }
        ]);

        if (existingSession.length > 0) {
            throw new ConflictException(
                `A session already exists at this time in the selected hall. startTime: ${existingSession[0].startTime} endTime: ${existingSession[0].endTime}`
            );
        }

        const session = new Session({
            date: createSessionDto.date,
            startTime: startTimeStr,
            endTime: endTimeStr,
            ticket_price: 15,
            cinema,
            hall,
            movie
        });

        return this.sessionsRepository.create(session);
    }

    @Transactional()
    async update(id: string, updateSessionDto: UpdateSessionDto) {
        const cinema = await this.cinemaService.findOne({ id: updateSessionDto.cinema });
        const hall = await this.hallService.findOne({ id: updateSessionDto.hall });
        const movie = await this.movieService.findOne(updateSessionDto.movie);

        if (hall.cinema.name !== cinema.name) {
            throw new Error('No such hall in cinema');
        }

        const newStartTime = moment(
            `${updateSessionDto.date} ${updateSessionDto.time}`,
            'YYYY-MM-DD HH:mm'
        );
        const newEndTime = newStartTime.clone().add(movie.duration, 'minutes');
        const newStartTimeStr = newStartTime.format('HH:mm');
        const newEndTimeStr = newEndTime.format('HH:mm');

        const existingSession = await this.sessionsRepository.find([
            {
                id: Not(id),
                cinema: { id: cinema.id },
                hall: { id: hall.id },
                date: updateSessionDto.date,
                startTime: Between(newStartTimeStr, newEndTimeStr)
            },
            {
                id: Not(id),
                cinema: { id: cinema.id },
                hall: { id: hall.id },
                date: updateSessionDto.date,
                endTime: Between(newStartTimeStr, newEndTimeStr)
            }
        ]);

        if (existingSession.length > 0) {
            throw new ConflictException(
                `A session already exists at this time in the selected hall. startTime: ${existingSession[0].startTime} endTime: ${existingSession[0].endTime}`
            );
        }

        const updateSessionData = {
            date: updateSessionDto.date,
            startTime: newStartTimeStr,
            endTime: newEndTimeStr,
            ticket_price: 15,
            cinema,
            hall,
            movie
        };

        return this.sessionsRepository.findOneAndUpdate({ id }, updateSessionData);
    }

    findMany(where: FindOptionsWhere<Session>) {
        return this.sessionsRepository.findMany({
            where,
            relations: ['movie'],
            order: { date: 'DESC' }
        });
    }

    findOne(id: string, relations?: string[]) {
        return this.sessionsRepository.findOne({ id }, relations);
    }

    delete(id: string) {
        return this.sessionsRepository.findOneAndDelete({ id });
    }
}
