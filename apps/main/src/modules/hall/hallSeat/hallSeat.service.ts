import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { HallSeatRepository } from './hallSeat.repository';
import { HallSeat } from './entities/hallSeat.entity';
import { Hall } from '../entities/hall.entity';
import { SeatService } from '../seat/seat.service';

@Injectable()
export class HallSeatService {
    constructor(
        private readonly hallSeatRepository: HallSeatRepository,
        private readonly seatService: SeatService
    ) {}

    async findOne(where: FindOptionsWhere<HallSeat>, relations?: string[]) {
        return this.hallSeatRepository.findOne(where, relations);
    }

    async findMany(where: FindOptionsWhere<HallSeat>, relations?: string[]) {
        return this.hallSeatRepository.find(where, relations);
    }

    async create(createSeatDto: any, hall: Hall) {
        const seat = await this.seatService.findOne({seat_type: createSeatDto.seatType});
        const hallSeat = new HallSeat({
            hall: hall,
            seat: seat
        });
        return this.hallSeatRepository.create(hallSeat);
    }

    delete(id: string) {
        console.log(`deleting seat ${id}`)
        return this.hallSeatRepository.findOneAndDelete({ id });
    }
}
