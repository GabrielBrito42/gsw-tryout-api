import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService: ConfigService = app.get(ConfigService);

  const apiPort = configService.get<string>('port')
  app.enableCors()
  app.use(bodyParser.json({ limit: '10mb' }))

  const port = Number(apiPort) || 8080
  await app.listen(port);
}
bootstrap();
