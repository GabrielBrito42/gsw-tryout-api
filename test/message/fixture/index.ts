import { MessageProps } from '../../../src/api/messages/dto'

import mongoose from 'mongoose';

const messageToAdd = (): MessageProps => {
  return {
    text: 'DE',
    receiverNumber: '12996210807',
    sendNumber: '12999999999',
    telephoneEncodedText: '',
  }
};

const messageTooLong = (): MessageProps => {
  return {
    text: 'TESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETE',
    receiverNumber: '12996210807',
    sendNumber: '12999999999',
    telephoneEncodedText: '',
  }
}

export { messageToAdd, messageTooLong }
