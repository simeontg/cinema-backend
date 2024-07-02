import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { FindOptionsWhere } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}
   
    async findOne(where: FindOptionsWhere<Role>) {
        return this.rolesRepository.findOne(where);
    }
}
