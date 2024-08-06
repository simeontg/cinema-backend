import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { Hall } from './entities/hall.entity';
import { HallController } from './hall.controller';
import { HallService } from './hall.service';
import { HallsRepository } from './hall.repository';
import { CinemaModule } from '../cinemas/cinema.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Seat } from './entities/seat.entity';
import { HallSeat } from './entities/hallSeat.entity';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([Hall, Seat, HallSeat]),
        LoggerModule,
        CinemaModule,
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
    controllers: [HallController],
    providers: [HallService, HallsRepository],
    exports: [HallService]
})
export class HallModule {}
