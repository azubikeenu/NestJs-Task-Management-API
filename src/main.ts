import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || config.get<number>('server.port');
  await app.listen(PORT);
  logger.log(`Application started on port ${PORT}`);
}

bootstrap();
