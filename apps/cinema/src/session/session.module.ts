import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { Session } from './entities/session.entity';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([Session]), LoggerModule],
    controllers: [SessionController],
    providers: [SessionService]
})
export class SessionModule {}
