import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { ReservationHallSeatRepository } from './reservationHallSeat.repository';
import { ReservationHallSeat } from './entities/reservationHallSeat.entity';
import { CreateReservationHallSeatDto } from './dto/create-reservationHallSeat.dto';
import { HallSeatService } from '../../hall/hallSeat/hallSeat.service';

@Injectable()
export class ReservationHallSeatService {
    constructor(
        private readonly reservationHallSeatRepository: ReservationHallSeatRepository,
        private readonly hallSeatService: HallSeatService
    ) {}

    async findOne(where: FindOptionsWhere<ReservationHallSeat>) {
        return this.reservationHallSeatRepository.findOne(where);
    }

    async findMany(where: FindOptionsWhere<ReservationHallSeat>) {
        return this.reservationHallSeatRepository.find(where);
    }

    async create(createReservationHallSeatDto: CreateReservationHallSeatDto) {
        const hallSeat = await this.hallSeatService.findOne({id: createReservationHallSeatDto.hallSeatId});

        const reservationHallSeat = new ReservationHallSeat({
            reservation: createReservationHallSeatDto.reservation,
            session: createReservationHallSeatDto.session,
            hallSeat: hallSeat,
            reserved: true
        });

        return this.reservationHallSeatRepository.create(reservationHallSeat);
    }
}
