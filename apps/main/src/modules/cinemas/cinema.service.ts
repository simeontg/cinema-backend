import { Injectable } from '@nestjs/common';
import { Cinema } from './entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { CityService } from '../city/city.service';
import { CinemasRepository } from './cinema.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CinemaService {
    constructor(
        private readonly cityService: CityService,
        private readonly cinemasRepository: CinemasRepository
    ) {}

    @Transactional()
    async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
        const city = await this.cityService.findOne({ name: createCinemaDto.city });
        const cinema = new Cinema({ name: createCinemaDto.name, city });
        return this.cinemasRepository.create(cinema);
    }

    findAll() {
        return this.cinemasRepository.find({});
    }

    findOne(name: string) {
        return this.cinemasRepository.findOne({ name });
    }
}
