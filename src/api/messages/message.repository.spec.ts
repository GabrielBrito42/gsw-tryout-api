import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose';

import { MessageRepository } from './message.repository';
import { Message, MessageDocument, MessageSchema } from './message.schema';

import { 
  closeInMongodConnection, 
  rootMongooseTestModule 
} from '../../../test/utils/mongoose-test-module'
import { messageToAdd } from '../../../test/message/fixture';

describe('Message Repository', () => {
  let repository: MessageRepository;
  let model: Model<MessageDocument>;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature(
          [
            {
              name: Message.name,
              schema: MessageSchema,
              collection: 'message',
            }
          ]
        )
      ],
      providers: [MessageRepository]
    }).compile()

    repository = module.get<MessageRepository>(MessageRepository);
    model = module.get<Model<MessageDocument>>(`${Message.name}Model`);
    app = module.createNestApplication();
    await app.init();
  })

  afterEach(async () => {
    await model.deleteMany({})
  })

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  })

  it('should be defined', () => {
    expect(repository).toBeDefined();
  })

  describe('get messages', () => {
    it('should return array of messages from database', async () => {
      const messageForAdd = messageToAdd();

      await repository.registerMessage(messageForAdd);
      await repository.registerMessage(messageForAdd);

      const messages = await repository.getAllMessages();

      expect(messages).toHaveLength(2);
    })
  })

  describe('save message', () => {
    it('given an message form, when method called, should save in database', async () => {
      const messageForAdd = messageToAdd();

      await repository.registerMessage(messageForAdd);
      const saved = await model.findOne();

      expect(saved.text).toEqual(messageForAdd.text);
      expect(saved.sendNumber).toEqual(messageForAdd.sendNumber);
      expect(saved.receiverNumber).toEqual(messageForAdd.receiverNumber);
      expect(saved.telephoneEncodedText).toEqual(messageForAdd.telephoneEncodedText);
    })

    it('given an message form, when method called, should save in database and find message by send number', async () => {
      const messageForAdd = messageToAdd();

      await repository.registerMessage(messageForAdd);
      const saved = await model.findOne({ sendNumber: messageForAdd.sendNumber });

      expect(saved.text).toEqual(messageForAdd.text);
      expect(saved.sendNumber).toEqual(messageForAdd.sendNumber);
      expect(saved.receiverNumber).toEqual(messageForAdd.receiverNumber);
      expect(saved.telephoneEncodedText).toEqual(messageForAdd.telephoneEncodedText);
    })
  })
})
