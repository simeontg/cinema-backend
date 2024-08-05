import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { MainModule } from './main.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    initializeTransactionalContext();
    const configService = new ConfigService();

    const app = await NestFactory.create(MainModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useLogger(app.get(Logger));
    app.use(cookieParser());
    app.enableCors({
        origin: configService.get('CLIENT_APP_URL'),
        credentials: true
    });
    await app.listen(3001);
}
bootstrap();
