import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { LoggerModule } from '@app/common';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    DatabaseModule, 
    DatabaseModule.forFeature([Movie]),
    LoggerModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
