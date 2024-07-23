import { Injectable } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { CinemaService } from '../cinemas/cinema.service';
import { Hall } from './entities/hall.entity';
import { HallsRepository } from './hall.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class HallService {
    constructor(
        private readonly cinemaService: CinemaService,
        private readonly hallsRepository: HallsRepository
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

    findOne(name: string) {
        return this.hallsRepository.findOne({ hall_name: name });
    }
}
