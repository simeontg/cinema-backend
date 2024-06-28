import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([Role])],
    providers: [RolesService, RolesRepository],
    exports: [RolesService]
})
export class RolesModule {}
