import { Module } from '@nestjs/common';
import { HealthModule, UploaderModule, LoggerModule } from '@app/common';
import { MainController } from './main.controller';
import { SessionModule } from './modules/sessions/session.module';
import { ReservationModule } from './modules/reservations/reservations.module';

@Module({
    imports: [
        LoggerModule,
        UploaderModule,
        ReservationModule,
        HealthModule,
        SessionModule
    ],
    controllers: [MainController]
})
export class MainModule {}
