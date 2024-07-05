import { Logger, NotFoundException } from "@nestjs/common";
import { EntityManager, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { AbstractEntity } from "./abstract.entity";
import { paginate } from "nestjs-typeorm-paginate";
import { PaginationOptions, Pagination } from "../pagination";

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
    protected abstract readonly logger: Logger;

    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager
    ) {}

    async create(entity: T): Promise<T> {
        return this.entityManager.save(entity);
    }

    async findOne(where: FindOptionsWhere<T>): Promise<T> {
        const entity = await this.entityRepository.findOne({where});

        if (!entity) {
            this.logger.warn('Entity not found with where', where);
            throw new NotFoundException('Entity not found');
        }

        return entity;
    }

    async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>) {
        const updateResult = await this.entityRepository.update(where, partialEntity);

        if (!updateResult.affected) {
            this.logger.warn('Entity was not found with where', where);
            throw new NotFoundException('Entity not found');
        }

        return this.findOne(where);
    }

    async find(where: FindOptionsWhere<T>) {
        return this.entityRepository.findBy(where);
    }

    async findOneAndDelete(where: FindOptionsWhere<T>) {
        await this.entityRepository.delete(where);
    }

    async paginate(options: PaginationOptions, searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>): Promise<Pagination<T>> {
        return paginate<T>(this.entityRepository, options, searchOptions);
    }
}