import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { LoggerModule } from '@app/common';
import { UploaderService } from '@app/common/uploader/uploader.service';
import { UploaderModule } from '@app/common/uploader/uploader.module';
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
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository, UploaderService],
})
export class MoviesModule {}
