import { Module } from '@nestjs/common';
import { HealthModule, UploaderModule, LoggerModule } from '@app/common';
import { MainController } from './main.controller';
import { SessionModule } from './modules/sessions/session.module';

@Module({
    imports: [
        LoggerModule,
        UploaderModule,
        HealthModule,
        SessionModule,
    ],
    controllers: [MainController]
})
export class MainModule {}
