import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { HallService } from '../hall/hall.service';
import { MoviesService } from '../movies/movies.service';
import { CinemaService } from '../cinemas/cinema.service';
import { Session } from './entities/session.entity';
import { SessionsRepository } from './session.repository';
import { Transactional } from 'typeorm-transactional';
import { Between, FindOptionsWhere, Not } from 'typeorm';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionHallSeatService } from './sessionHallSeat/sessionHallSeat.service';
import * as moment from 'moment';

@Injectable()
export class SessionService {
    constructor(
        private readonly movieService: MoviesService,
        private readonly hallService: HallService,
        private readonly cinemaService: CinemaService,
        private readonly sessionHallSeatService: SessionHallSeatService,
        private readonly sessionsRepository: SessionsRepository
    ) {}

    @Transactional()
    async create(createSessionDto: CreateSessionDto) {
        const cinema = await this.cinemaService.findOne({ id: createSessionDto.cinema });
        const hall = await this.hallService.findOne({ id: createSessionDto.hall }, ['hallSeats']);
        const movie = await this.movieService.findOne(createSessionDto.movie);
        if (hall.cinema.name !== cinema.name) {
            throw new BadRequestException('No such hall in cinema');
        }

        if (new Date(movie.releaseDate) > new Date(createSessionDto.date)) {
            throw new BadRequestException('Cannot set session before movie is released!');
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
            cinema,
            hall,
            movie
        });

        const createdSession = await this.sessionsRepository.create(session);

        hall.hallSeats.forEach((hallSeat) => {
            this.sessionHallSeatService.create(
                hallSeat,
                createdSession,
                Number(createSessionDto.seatPrices[hallSeat.seat.seat_type])
            );
        });

        return createdSession;
    }

    @Transactional()
    async update(id: string, updateSessionDto: UpdateSessionDto) {
        const cinema = await this.cinemaService.findOne({ id: updateSessionDto.cinema });
        const hall = await this.hallService.findOne({ id: updateSessionDto.hall }, ['hallSeats']);
        const movie = await this.movieService.findOne(updateSessionDto.movie);

        if (hall.cinema.name !== cinema.name) {
            throw new Error('No such hall in cinema');
        }

        const session = await this.sessionsRepository.findOne({ id }, ['reservationHallSeats']);

        if (session.reservationHallSeats.length > 0) {
            throw new BadRequestException(
                'Session has active reservations and cannot be modified.'
            );
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
            cinema,
            hall,
            movie
        };
        const updatedSession = await this.sessionsRepository.findOneAndUpdate(
            { id },
            updateSessionData
        );

        hall.hallSeats.forEach((hallSeat) => {
            this.sessionHallSeatService.update(hallSeat.id, {
                price: Number(updateSessionDto.seatPrices[hallSeat.seat.seat_type])
            });
        });

        return updatedSession;
    }

    async findMany(where: FindOptionsWhere<Session>) {
        const sessions = await this.sessionsRepository.findMany({
            where,
            relations: ['movie', 'sessionHallSeats', 'sessionHallSeats.hallSeat'],
            order: { date: 'DESC' }
        });
        const sessionWithSeatPrices = sessions.map((session) => {
            const seatPrices = session.sessionHallSeats.reduce((acc, sessionHallSeat) => {
                const seatType = sessionHallSeat.hallSeat.seat.seat_type;
                if (!acc[seatType]) {
                    acc[seatType] = sessionHallSeat.price;
                }
                return acc;
            }, {});

            return {
                ...session,
                seatPrices
            };
        });

        return sessionWithSeatPrices;
    }

    findOne(id: string, relations?: string[]) {
        return this.sessionsRepository.findOne({ id }, relations);
    }

    delete(id: string) {
        return this.sessionsRepository.findOneAndDelete({ id });
    }
}
