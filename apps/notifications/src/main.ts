import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    initializeTransactionalContext();
    const app = await NestFactory.create(NotificationsModule);
    const configService = app.get(ConfigService);
    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: configService.get('NOTIFICATIONS_TCP_PORT')
        }
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useLogger(app.get(Logger));
    app.enableCors({
        origin: configService.get('CLIENT_APP_URL'),
        credentials: true
    });
    await app.startAllMicroservices();
    await app.listen(configService.get('NOTIFICATIONS_HTTP_PORT'));
}
bootstrap();
