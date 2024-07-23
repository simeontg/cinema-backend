import { Module } from '@nestjs/common';
import { DatabaseModule, HealthModule, UploaderModule, LoggerModule } from '@app/common';

import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';

@Module({
  imports: [
    DatabaseModule, 
    DatabaseModule.forFeature([Movie]),
    LoggerModule,
    UploaderModule,
    HealthModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesService]
})
export class MoviesModule {}
