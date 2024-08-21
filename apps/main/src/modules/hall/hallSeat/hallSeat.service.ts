import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { HallSeatRepository } from './hallSeat.repository';
import { HallSeat } from './entities/hallSeat.entity';

@Injectable()
export class HallSeatService {
    constructor(private readonly hallSeatRepository: HallSeatRepository) {}

    async findOne(where: FindOptionsWhere<HallSeat>) {
        return this.hallSeatRepository.findOne(where);
    }

    async findMany(where: FindOptionsWhere<HallSeat>) {
        return this.hallSeatRepository.find(where);
    }
}