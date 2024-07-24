import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesRepository extends AbstractRepository<City> {
    protected readonly logger = new Logger(CitiesRepository.name);

    constructor(
        @InjectRepository(City)
        reservationsRepository: Repository<City>,
        entityManager: EntityManager
    ) {
        super(reservationsRepository, entityManager);
    }
}
