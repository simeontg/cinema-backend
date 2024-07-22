import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Cinema } from './entities/cinema.entity';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([Cinema]), LoggerModule],
    controllers: [CinemaController],
    providers: [CinemaService]
})
export class CinemaModule {}
