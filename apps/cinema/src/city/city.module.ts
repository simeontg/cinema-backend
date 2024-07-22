import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { City } from './entities/city.entity';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([City]), LoggerModule]
})
export class CinemaModule {}
