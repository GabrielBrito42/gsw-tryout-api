import { 
  Test, 
  TestingModule 
} from '@nestjs/testing';
import { 
  INestApplication, 
  HttpException 
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { 
  ConfigService, 
  ConfigModule 
} from '@nestjs/config';
import { SinonSandbox } from 'sinon';
import { 
  rootMongooseTestModule, 
  closeInMongodConnection 
} from '../../../test/utils/mongoose-test-module';

import { MessageController } from './message.controller';
import { MessageModule } from './message.module';
import { MessageService } from './message.service';
import { MessageSchema, Message } from './message.schema';
import { MessageRepository } from './message.repository';

import { messageTooLong } from '../../../test/message/fixture';

import configuration from '../../config/configurations';
import * as sinon from 'sinon';
import * as request from 'supertest';

describe('MessagesController', () => {
  let app: INestApplication;
  let sandbox: SinonSandbox;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MessageModule,
        ConfigModule.forRoot({
          load: [configuration]
        }),
        MongooseModule.forFeature(
          [
            { 
              name: Message.name, 
              schema: MessageSchema, 
              collection: 'message' 
            }
          ]
        ),
      ],
      controllers: [MessageController],
      providers: [
        ConfigService, 
        MessageService,
        MessageRepository
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    sandbox = sinon.createSandbox();
    await app.init();
  })

  afterEach(async () => {
    sandbox.restore();
  })

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  })

  describe('/get-messages', () => {
    it('should return status 200 when get messages', async () => {
      sandbox.stub(MessageService.prototype, 'getAllMessages').resolves([{}]);

      await request(app.getHttpServer())
        .get('/get-messages')
        .set({ 'Accept': 'application/json' })
        .expect(200)
    })
  })

  describe('/decode-message', () => {
    it('should return status 200 when message form is valid', async () => {
      sandbox.stub(MessageService.prototype, 'decodeMessage').resolves('');

      await request(app.getHttpServer())
        .post('/decode-message')
        .set({ 'Accept': 'application/json' })
        .send({
          "text": "TESTE DE MESA",
          "sendNumber": "12996210807",
          "receiverNumber": "12996210807"
        })
        .expect(201)
    })

    it('should return status 500 when message form is invalid', async () => {
      sandbox.stub(MessageService.prototype, 'decodeMessage')
        .throwsException(
          new HttpException('Preencha todos os campos corretamente', 500)
        );

      await request(app.getHttpServer())
        .post('/decode-message')
        .set({ 'Accept': 'application/json' })
        .send({})
        .expect(500)
    })

    it('should return status 500 when message size surprasses max lenght', async () => {
      const messageToSend = messageTooLong();
      
      sandbox.stub(MessageService.prototype, 'decodeMessage')
        .throwsException(
          new HttpException('O texto excede o limite de caracteres', 500)
        );

      await request(app.getHttpServer())
        .post('/decode-message')
        .set({ 'Accept': 'application/json' })
        .send({
          messageToSend
        })
        .expect(500)
    })
  })
})
