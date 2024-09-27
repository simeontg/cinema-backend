import { ConflictException, Injectable } from '@nestjs/common';
import { Cinema } from './entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { CityService } from '../city/city.service';
import { CinemasRepository } from './cinema.repository';
import { Transactional } from 'typeorm-transactional';
import { FindOptionsWhere } from 'typeorm';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemaService {
    constructor(
        private readonly cityService: CityService,
        private readonly cinemasRepository: CinemasRepository
    ) {}

    @Transactional()
    async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
        let city = await this.cityService.findOne({ name: createCinemaDto.city });
        if (!city) {
            city = await this.cityService.create(createCinemaDto.city);
        }

        const duplicateCinema = await this.cinemasRepository.findOne({
            name: createCinemaDto.name,
            city: { id: city.id }
        });
        if (duplicateCinema) {
            throw new ConflictException(
                `Cinema ${createCinemaDto.name} already exists in ${city.name}`
            );
        }

        const cinema = new Cinema({ name: createCinemaDto.name, city });
        return this.cinemasRepository.create(cinema);
    }

    async update(id: string, updateCinemaDto: UpdateCinemaDto) {
        let city = await this.cityService.findOne({ name: updateCinemaDto.city });
        if (!city) {
            city = await this.cityService.create(updateCinemaDto.city);
        }
        return this.cinemasRepository.findOneAndUpdate(
            { id },
            { name: updateCinemaDto.name, city }
        );
    }

    findAll() {
        return this.cinemasRepository.find({}, ['halls']);
    }

    findOne(where: FindOptionsWhere<Cinema>) {
        return this.cinemasRepository.findOne(where);
    }

    remove(id: string) {
        return this.cinemasRepository.findOneAndDelete({ id });
    }
}
