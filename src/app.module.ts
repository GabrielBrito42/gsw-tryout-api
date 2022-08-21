import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './api/messages/message.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import configuration from './config/configurations';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUrl'),
      }),
      inject: [ConfigService],
    }),
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
