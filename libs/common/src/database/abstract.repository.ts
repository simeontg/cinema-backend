import { Logger, NotFoundException } from "@nestjs/common";
import { EntityManager, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { AbstractEntity } from "./abstract.entity";

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
        const entity = await this.entityRepository.findOne({ where });

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

    async findBy(where: FindOptionsWhere<T>) {
        return this.entityRepository.findBy(where);
    }

    async find(options: FindManyOptions) {
        return await this.entityRepository.find(options);
    }

    async findAndCount(options: FindManyOptions) {
        return await this.entityRepository.findAndCount(options);
    }

    async findOneAndDelete(where: FindOptionsWhere<T>) {
        await this.entityRepository.delete(where);
    }
}