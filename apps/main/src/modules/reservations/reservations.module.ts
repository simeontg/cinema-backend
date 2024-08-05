import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservations.repository';
import { ReservationService } from './reservations.service';
import { ReservationController } from './reservations.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModule } from '../sessions/session.module';
import { ReservationStatusModule } from '../reservation_status/reservation-status.module';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([Reservation]),
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
        SessionModule,
        ReservationStatusModule
    ],
    controllers: [ReservationController],
    providers: [ReservationRepository, ReservationService]
})
export class ReservationModule {}
