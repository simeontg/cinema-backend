import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { SessionHallSeat } from './entities/sessionHallSeat.entity';
import { SessionHallSeatRepository } from './sessionHallSeat.repository';
import { HallSeat } from '../../hall/hallSeat/entities/hallSeat.entity';
import { Session } from '../entities/session.entity';
import { UpdateSessionHallSeatDto } from './dto/update-sessionHallSeat.dto';

@Injectable()
export class SessionHallSeatService {
    constructor(private readonly sessionHallSeatRepository: SessionHallSeatRepository) {}

    async findOne(where: FindOptionsWhere<SessionHallSeat>) {
        return this.sessionHallSeatRepository.findOne(where);
    }

    async findMany(where: FindOptionsWhere<SessionHallSeat>) {
        return this.sessionHallSeatRepository.find(where);
    }

    create(hallSeat: HallSeat, session: Session, price: number) {
        const sessionHallSeat = new SessionHallSeat({
            hallSeat,
            session,
            price
        });
        return this.sessionHallSeatRepository.create(sessionHallSeat);
    }

    async update(hallSeatId: string, updateSessionHallSeatDto: UpdateSessionHallSeatDto) {
        return this.sessionHallSeatRepository.findOneAndUpdate({hallSeat: {id: hallSeatId}}, updateSessionHallSeatDto)
    }
}
