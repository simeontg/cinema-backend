import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HallSeat } from './entities/hallSeat.entity';
import { HallSeatRepository } from './hallSeat.repository';
import { HallSeatService } from './hallSeat.service';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([HallSeat]),
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
    providers: [HallSeatRepository, HallSeatService],
    exports: [HallSeatService]
})
export class HallSeatModule {}
