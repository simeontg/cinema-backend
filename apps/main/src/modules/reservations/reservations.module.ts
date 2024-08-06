import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservations.repository';
import { ReservationService } from './reservations.service';
import { ReservationController } from './reservations.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModule } from '../sessions/session.module';
import { ReservationProcessor } from './reservations.proccesor';
import { BullModule } from '@nestjs/bull';
import { ReservationHallSeats } from './entities/reservationHallSeat.entity';
import { ReservationStatusModule } from './reservationStatus/reservationStatus.module';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([Reservation, ReservationHallSeats]),
        LoggerModule,
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
        ]),
        BullModule.forRoot({
            redis: {
                host: 'redis',
                port: 6379
            }
        }),
        BullModule.registerQueue({
            name: 'reservation'
        }),
        SessionModule,
        ReservationStatusModule
    ],
    controllers: [ReservationController],
    providers: [ReservationRepository, ReservationService, ReservationProcessor]
})
export class ReservationModule {}
