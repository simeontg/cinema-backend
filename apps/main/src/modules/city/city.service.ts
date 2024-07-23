import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { City } from './entities/city.entity';
import { CitiesRepository } from './city.repository';

@Injectable()
export class CityService {
    constructor(private readonly citiesRepository: CitiesRepository) {}

    findOne(where: FindOptionsWhere<City>): Promise<City> {
        return this.citiesRepository.findOne(where);
    }

    create(name: string) {
        const city = new City({ name });
        return this.citiesRepository.create(city);
    }

    findAll() {
        return this.citiesRepository.find({});
    }
}
