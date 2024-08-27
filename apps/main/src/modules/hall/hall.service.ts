import { Injectable, NotFoundException } from '@nestjs/common';
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
        const cinema = await this.cinemaService.findOne(createHallDto.cinema);
        const hall = new Hall({
            hall_name: createHallDto.name,
            hall_plan: createHallDto.plan,
            cinema
        });
        return this.hallsRepository.create(hall);
    }

    findAll() {
        return this.hallsRepository.find({});
    }

    findOne(where: FindOptionsWhere<Hall>) {
        return this.hallsRepository.findOne(where);
    }

    @Transactional()
    async getMappedHallPlan(hallId: string, sessionId: string) {
        const hall = await this.findOne({ id: hallId });
        const hallPlan = await this.mapHallPlan(hall.hall_plan, sessionId);
        return hallPlan
    }

    async mapHallPlan(hallPlan: HallPlan, sessionId: string): Promise<HallPlanResponseDto> {
        const mappedHallPlan: HallPlanResponseDto = {};
    
        for (const key in hallPlan) {
            mappedHallPlan[key] = await Promise.all(
                hallPlan[key].map(async (seat, idx) => {
                    const hallSeat = await this.hallSeatService.findOne({ id: seat.id });
                    let reserved = false;
                    try {
                        await this.reservationHallSeatService.findOne({
                            hallSeat: { id: hallSeat.id },
                            session: { id: sessionId }
                        });
                        reserved = true;
                    } catch (err) {
                        // haven't found the seat in reservationHallSeat -> continue with reserved = false
                    }
    
                    return {
                        id: seat.id,
                        seat_type: hallSeat.seat.seat_type,
                        price: hallSeat.seat.price,
                        location: `Row ${key} Seat ${idx + 1}`,
                        reserved
                    };
                })
            );
        }
        return mappedHallPlan;
    }
}
