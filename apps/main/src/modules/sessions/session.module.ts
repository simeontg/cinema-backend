import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule, AUTH_SERVICE } from '@app/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { Session } from './entities/session.entity';
import { HallModule } from '../hall/hall.module';
import { CinemaModule } from '../cinemas/cinema.module';
import { MoviesModule } from '../movies/movies.module';
import { SessionsRepository } from './session.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionHallSeat } from './sessionHallSeat/entities/sessionHallSeat.entity';
import { SessionHallSeatService } from './sessionHallSeat/sessionHallSeat.service';
import { SessionHallSeatRepository } from './sessionHallSeat/sessionHallSeat.repository';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([Session, SessionHallSeat]),
        LoggerModule,
        HallModule,
        CinemaModule,
        MoviesModule,
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
    controllers: [SessionController],
    providers: [SessionService, SessionsRepository, SessionHallSeatService, SessionHallSeatRepository],
    exports: [SessionService]
})
export class SessionModule {}
