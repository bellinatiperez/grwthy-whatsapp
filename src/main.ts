import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const corsOrigin = configService.get<string>('app.corsOrigin') || '';
  const origins = corsOrigin
    ? corsOrigin.split(',').map((o) => o.trim())
    : ['https://grwthy.com'];
  app.enableCors({ origin: origins });

  const port = configService.get<number>('app.port') || 3100;
  await app.listen(port);
  logger.log(`WhatsApp Meta API running on port ${port}`);
}
bootstrap();
