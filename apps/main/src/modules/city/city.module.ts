import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { City } from './entities/city.entity';
import { CityService } from './city.service';
import { CitiesRepository } from './city.repository';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([City]), LoggerModule],
    providers: [CityService, CitiesRepository],
    exports: [CityService]
})
export class CityModule {}
