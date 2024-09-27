import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { CinemaService } from '../cinemas/cinema.service';
import { Hall } from './entities/hall.entity';
import { HallsRepository } from './hall.repository';
import { Transactional } from 'typeorm-transactional';
import { FindOptionsWhere } from 'typeorm';
import { HallSeatService } from './hallSeat/hallSeat.service';
import { ReservationHallSeatService } from '../reservations/reservationHallSeat/reservationHallSeat.service';
import { HallPlan } from './types/hallPlan';
import { HallPlanResponseDto } from './dto/hallPlan-response.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Injectable()
export class HallService {
    constructor(
        private readonly cinemaService: CinemaService,
        private readonly hallsRepository: HallsRepository,
        private readonly hallSeatService: HallSeatService,
        private readonly reservationHallSeatService: ReservationHallSeatService
    ) {}

    @Transactional()
    async create(createHallDto: CreateHallDto) {
        const cinema = await this.cinemaService.findOne({ id: createHallDto.cinemaId });

        const duplicatedHall = await this.hallsRepository.findOne({
            hall_name: createHallDto.hallName,
            cinema: { id: cinema.id }
        });

        if (duplicatedHall) {
            throw new ConflictException(
                `${createHallDto.hallName} already exists in ${cinema.name}`
            );
        }

        const hall = new Hall({
            hall_name: createHallDto.hallName,
            cinema
        });
        const savedHall = await this.hallsRepository.create(hall);

        const hallPlan: { [key: string]: { id: string }[] } = {};

        await Promise.all(
            createHallDto.hallPlan.map(async (row, index) => {
                const rowPromises = row.seats.map(async (seat) => {
                    const seatPromises = [];
                    for (let i = 0; i < seat.seatCount; i++) {
                        const hallSeat = await this.hallSeatService.create(seat, savedHall);
                        seatPromises.push({ id: hallSeat.id });
                    }
                    return seatPromises;
                });

                const seats = (await Promise.all(rowPromises)).flat();
                hallPlan[index + 1] = seats;
            })
        );

        const hallWithHallPlan = await this.hallsRepository.findOneAndUpdate(
            { id: savedHall.id },
            {
                hall_plan: hallPlan
            }
        );

        return hallWithHallPlan;
    }

    @Transactional()
    async update(id: string, updateHallDto: UpdateHallDto) {
        const cinema = await this.cinemaService.findOne({ id: updateHallDto.cinemaId });

        const duplicatedHall = await this.hallsRepository.findOne({
            hall_name: updateHallDto.hallName,
            cinema: { id: cinema.id }
        });
        if (duplicatedHall) {
            throw new ConflictException(
                `${updateHallDto.hallName} already exists in ${cinema.name}`
            );
        }

        const hall = await this.hallsRepository.findOne({ id: id }, ['sessions']);

        if (hall.sessions.some((session) => new Date(session.date) > new Date())) {
            throw new UnauthorizedException('There are upcoming sessions in this hall.');
        }

        const currentHallSeats = await this.hallSeatService.findMany({ hall: { id: hall.id } }, [
            'reservationHallSeats'
        ]);

        for (let hallSeat of currentHallSeats) {
            if (hallSeat.reservationHallSeats.length === 0) {
                await this.hallSeatService.delete(hallSeat.id);
            }
        }

        const hallPlan: { [key: string]: { id: string }[] } = {};

        await Promise.all(
            updateHallDto.hallPlan.map(async (row, index) => {
                const rowPromises = row.seats.map(async (seat) => {
                    const seatPromises = [];
                    for (let i = 0; i < seat.seatCount; i++) {
                        const hallSeat = await this.hallSeatService.create(seat, hall);
                        seatPromises.push({ id: hallSeat.id });
                    }
                    return seatPromises;
                });

                const seats = (await Promise.all(rowPromises)).flat();
                hallPlan[index + 1] = seats;
            })
        );

        const hallWithHallPlan = await this.hallsRepository.findOneAndUpdate(
            { id: hall.id },
            {
                hall_plan: hallPlan,
                cinema: cinema,
                hall_name: updateHallDto.hallName
            }
        );

        return hallWithHallPlan;
    }

    findAll() {
        return this.hallsRepository.find({});
    }

    findOne(where: FindOptionsWhere<Hall>, relations?: string[]) {
        return this.hallsRepository.findOne(where, relations);
    }

    @Transactional()
    async getMappedHallPlan(hallId: string, sessionId: string) {
        const hall = await this.findOne({ id: hallId });
        const hallPlan = await this.mapHallPlan(hall.hall_plan, sessionId);
        return hallPlan;
    }

    async mapHallPlan(hallPlan: HallPlan, sessionId?: string): Promise<HallPlanResponseDto> {
        const mappedHallPlan: HallPlanResponseDto = {};

        for (const key in hallPlan) {
            mappedHallPlan[key] = await Promise.all(
                hallPlan[key].map(async (seat, idx) => {
                    const hallSeat = await this.hallSeatService.findOne({ id: seat.id }, [
                        'sessionHallSeats',
                        'sessionHallSeats.session'
                    ]);

                    let sessionHallSeat = null;
                    let reserved = false;

                    if (sessionId) {
                        const reservedSeat = await this.reservationHallSeatService.findOne({
                            hallSeat: { id: hallSeat.id },
                            session: { id: sessionId }
                        });
                        if (reservedSeat) {
                            reserved = true;
                        }

                        sessionHallSeat = hallSeat.sessionHallSeats.find(
                            (sessionHallSeat) => sessionHallSeat.session.id === sessionId
                        );
                    }

                    return {
                        id: seat.id,
                        seat_type: hallSeat.seat.seat_type,
                        price: sessionHallSeat ? sessionHallSeat.price : null,
                        location: `Row ${key} Seat ${idx + 1}`,
                        reserved
                    };
                })
            );
        }
        return mappedHallPlan;
    }

    async getTypesOfSeats(hallId: string) {
        const seats = await this.hallSeatService.findMany({ hall: { id: hallId } });
        const uniqueSeatTypes = [...new Set(seats.map((seat) => seat.seat.seat_type))];
        return uniqueSeatTypes;
    }

    delete(id: string) {
        return this.hallsRepository.findOneAndDelete({ id });
    }
}
