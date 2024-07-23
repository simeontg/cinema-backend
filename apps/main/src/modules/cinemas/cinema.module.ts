import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { Cinema } from './entities/cinema.entity';
import { CityModule } from '../city/city.module';
import { CinemasRepository } from './cinema.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([Cinema]),
        LoggerModule,
        CityModule,
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
    controllers: [CinemaController],
    providers: [CinemaService, CinemasRepository],
    exports: [CinemaService]
})
export class CinemaModule {}
