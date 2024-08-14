import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReservationStatusRepository } from './reservationStatus.repository';
import { ReservationStatusService } from './reservationStatus.service';
import { ReservationStatus } from './entities/reservation-status.entity';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([ReservationStatus]),
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
        ])
    ],
    providers: [ReservationStatusRepository, ReservationStatusService],
    exports: [ReservationStatusService]
})
export class ReservationStatusModule {}
