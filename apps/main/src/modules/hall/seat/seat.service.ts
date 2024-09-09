import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import { SeatRepository } from './seat.repository';
import { Seat } from './entities/seat.entity';

@Injectable()
export class SeatService {
    constructor(private readonly seatRepository: SeatRepository) {}

    async findOne(where: FindOptionsWhere<Seat>, relations?: string[]) {
        return this.seatRepository.findOne(where, relations);
    }

    async findMany(where: FindOptionsWhere<Seat>) {
        return this.seatRepository.find(where);
    }
}
