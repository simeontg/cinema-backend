import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Movie } from "./entities/movie.entity";


@Injectable()
export class MoviesRepository extends AbstractRepository<Movie> {
    protected readonly logger = new Logger(MoviesRepository.name);

    constructor(
        @InjectRepository(Movie)
        reservationsRepository: Repository<Movie>,
        entityManager: EntityManager
    ) {
        super(reservationsRepository, entityManager);
    }
}