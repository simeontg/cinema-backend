import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { MoviesModule } from './movies.module';

async function bootstrap() {
  const app = await NestFactory.create(MoviesModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
