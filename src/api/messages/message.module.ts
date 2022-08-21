import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MessageSchema, Message } from './message.schema'

import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Message.name, 
        schema: MessageSchema, 
        collection: 'message', 
      }
    ])
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepository
  ],
})
export class MessageModule {}
