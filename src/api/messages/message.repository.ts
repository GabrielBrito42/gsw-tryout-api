import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Message, MessageDocument } from './message.schema';

import type { MessageProps } from './dto'

@Injectable()
export class MessageRepository {
  constructor(@InjectModel(Message.name) private model: Model<MessageDocument>) {}

  async getAllMessages() {
    return this.model.find().lean();
  }

  registerMessage(messageDto: MessageProps): Promise<Message> {
    const message: Message = new Message(messageDto);
    const messageDocument: MessageDocument = new this.model(message);
    return messageDocument.save();
  }
}
