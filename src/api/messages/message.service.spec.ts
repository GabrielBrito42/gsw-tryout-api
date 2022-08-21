import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { 
  Test, 
  TestingModule 
} from '@nestjs/testing';

import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { MessageModule } from './message.module'
import { 
  Message, 
  MessageSchema 
} from './message.schema';

import { SinonSandbox } from 'sinon';
import { 
  closeInMongodConnection, 
  rootMongooseTestModule 
} from '../../../test/utils/mongoose-test-module';

import { messageTooLong } from '../../../test/message/fixture';

import * as sinon from 'sinon';
import configuration from '../../config/configurations';
import mongoose from 'mongoose';

describe('Message Service', () => {
  let app: INestApplication;
  let sandbox: SinonSandbox;
  let service: MessageService;
  let repository: MessageRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature(
          [
            { 
              name: Message.name, 
              schema: MessageSchema, 
              collection: 'message' 
            }
          ]
        ),
        MessageModule,
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true
        })
      ],
      providers: [
        MessageRepository, 
        MessageService
      ]
    }).compile()

    service = module.get<MessageService>(MessageService);
    repository = module.get<MessageRepository>(MessageRepository);
    sandbox = sinon.createSandbox();
    app = module.createNestApplication();
    await app.init();
  })

  afterEach(async () => {
    sandbox.restore();
  })

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  describe('get messages', () => {
    let repositoryGetMessagesStub: sinon.SinonStub;

    it('should return array of messages', async () => {
      repositoryGetMessagesStub = sandbox
        .stub(repository, 'getAllMessages')
        .resolves([
          {
            _id: new mongoose.Types.ObjectId('55153a8014829a865bbf700d'),
            text: 'de',
            receiverNumber: '12999999999',
            sendNumber: '12999999999',
            telephoneEncodedText: '3_33',
            createdAt: new Date('2022-08-20T14:30:51.693+00:00'),
          }
        ])

        const response = await service.getAllMessages();

        sinon.assert.callCount(repositoryGetMessagesStub, 1);
        sinon.assert.match(
          [
            {
              _id: new mongoose.Types.ObjectId('55153a8014829a865bbf700d'),
              text: 'de',
              receiverNumber: '12999999999',
              sendNumber: '12999999999',
              telephoneEncodedText: '3_33',
              createdAt: new Date('2022-08-20T14:30:51.693+00:00'),
              formattedCreatedAt: '20/08/2022 11:30:51',
              formattedReceiverNumber: '(12) 99999-9999'
            }
          ],
          response
        );
    })
  })

  describe('decode', () => {
    let repositorySaveMessageStub: sinon.SinonStub;

    it('given a valid message form, with t9text, when method is called save message and decode message', async () => {
      repositorySaveMessageStub = sandbox
        .stub(repository, 'registerMessage')
        .resolves({
          _id: new mongoose.Types.ObjectId('55153a8014829a865bbf700d'),
          text: 'de',
          receiverNumber: '12999999999',
          sendNumber: '12999999999',
          telephoneEncodedText: '3_33'
        })

      const response = await service.decodeMessage({
        text: '3_33',
        receiverNumber: '12999999999',
        sendNumber: '12999999999',
        telephoneEncodedText: '',
      });
      
      sinon.assert.callCount(repositorySaveMessageStub, 1);
      sinon.assert.match(
        'DE',
        response
      );
    })

    it('given a valid message form, with normal text, when method is called save message and decode message', async () => {
      repositorySaveMessageStub = sandbox
        .stub(repository, 'registerMessage')
        .resolves({
          _id: new mongoose.Types.ObjectId('55153a8014829a865bbf700d'),
          text: 'de',
          receiverNumber: '12999999999',
          sendNumber: '12999999999',
          telephoneEncodedText: '3_33'
        })

      const response = await service.decodeMessage({
        text: 'DE',
        receiverNumber: '12999999999',
        sendNumber: '12999999999',
        telephoneEncodedText: '',
      });
      
      sinon.assert.callCount(repositorySaveMessageStub, 1);
      sinon.assert.match(
        '3_33',
        response
      );
    })

    it('given a invalid form, should throw http error 500, with message Preecha todos os campos', async () => {
      repositorySaveMessageStub = sandbox
        .stub(repository, 'registerMessage')
        .resolves({
          _id: new mongoose.Types.ObjectId('55153a8014829a865bbf700d'),
          text: 'de',
          receiverNumber: '12999999999',
          sendNumber: '12999999999',
          telephoneEncodedText: '3_33'
        })
      
      const err = await handleAsyncError(async() => 
        await service.decodeMessage(
          {
            text: null, 
            receiverNumber: null, 
            sendNumber: null, 
            telephoneEncodedText: null
          }
        )
      )

      sinon.assert.callCount(repositorySaveMessageStub, 0);
      expect(err.response).toEqual('Preencha todos os campos corretamente');
      expect(err.status).toEqual(500);
    })

    it('given a valid form with message too long, should throw http error 500, with message O texto excede o limite de caracteres', async () => {
      const messageTooAdd = messageTooLong();
      
      repositorySaveMessageStub = sandbox
        .stub(repository, 'registerMessage')
        .resolves({
          _id: new mongoose.Types.ObjectId('55153a8014829a865bbf700d'),
          text: 'de',
          receiverNumber: '12999999999',
          sendNumber: '12999999999',
          telephoneEncodedText: '3_33'
        })
      
      const err = await handleAsyncError(async() => 
        await service.decodeMessage(
          messageTooAdd
        )
      )

      sinon.assert.callCount(repositorySaveMessageStub, 0);
      expect(err.response).toEqual('O texto excede o limite de caracteres');
      expect(err.status).toEqual(500);
    })
  })
})

async function handleAsyncError(fn) {
  try {
    await fn()
  } catch (e) {
    return e
  }
}
