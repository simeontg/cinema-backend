import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReservationHallSeat } from './entities/reservationHallSeat.entity';
import { HallSeatModule } from '../../hall/hallSeat/hallSeat.module';
import { ReservationHallSeatRepository } from './reservationHallSeat.repository';
import { ReservationHallSeatService } from './reservationHallSeat.service';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([ReservationHallSeat]),
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
        HallSeatModule
    ],
    providers: [ReservationHallSeatRepository, ReservationHallSeatService],
    exports: [ReservationHallSeatService]
})
export class ReservationHallSeatModule {}
