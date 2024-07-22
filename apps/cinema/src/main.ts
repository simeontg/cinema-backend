import { NestFactory } from '@nestjs/core';
import { CinemaModule } from './cinema.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    initializeTransactionalContext();

    const app = await NestFactory.create(CinemaModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useLogger(app.get(Logger));
    app.enableCors();
    await app.listen(3003);
}
bootstrap();
