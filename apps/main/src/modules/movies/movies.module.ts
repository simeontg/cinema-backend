import { Module } from '@nestjs/common';
import {
    DatabaseModule,
    HealthModule,
    UploaderModule,
    LoggerModule,
    AUTH_SERVICE
} from '@app/common';

import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([Movie]),
        LoggerModule,
        UploaderModule,
        HealthModule,
        ClientsModule.registerAsync([
            {
                name: AUTH_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('AUTH_HOST'),
                        port: configService.get('AUTH_PORT')
                    }
                }),
                inject: [ConfigService],
                imports: [ConfigModule]
            }
        ])
    ],
    controllers: [MoviesController],
    providers: [MoviesService, MoviesRepository],
    exports: [MoviesService]
})
export class MoviesModule {}
