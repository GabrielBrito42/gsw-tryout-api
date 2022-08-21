import { 
  Prop,
  Schema,
  SchemaFactory 
} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

type MessageProps = {
  text: string,
  sendNumber: string,
  receiverNumber: string,
  telephoneEncodedText: string,
}

export type MessageDocument = Message & mongoose.Document;

@Schema({ versionKey: false, timestamps: true })
export class Message {
  constructor(message: MessageProps) {
    this.text = message?.text
    this.sendNumber = message?.sendNumber
    this.receiverNumber = message?.receiverNumber
    this.telephoneEncodedText = message?.telephoneEncodedText
  }

  _id?: mongoose.Types.ObjectId

  createdAt?: Date

  @Prop()
  text: string

  @Prop()
  telephoneEncodedText: string

  @Prop()
  sendNumber: string

  @Prop()
  receiverNumber: string
}

export const MessageSchema = SchemaFactory.createForClass(Message);
