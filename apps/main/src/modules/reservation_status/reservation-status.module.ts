import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModule } from '../sessions/session.module';
import { ReservationStatus } from './entities/reservation-status.entity';
import { ReservationStatusRepository } from './reservation-status.repository';
import { ReservationStatusService } from './reservation-status.service';

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
        ]),
        SessionModule
    ],
    providers: [ReservationStatusRepository, ReservationStatusService],
    exports: [ReservationStatusService]
})
export class ReservationStatusModule {}
