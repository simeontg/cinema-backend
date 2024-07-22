import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Hall } from './entities/hall.entity';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([Hall]), LoggerModule]
})
export class CinemaModule {}
