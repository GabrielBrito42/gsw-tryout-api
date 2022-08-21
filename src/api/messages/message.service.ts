import { Injectable, HttpException } from '@nestjs/common';

import { MessageRepository } from './message.repository'

import type { MessageProps, MessagesUi } from './dto'

@Injectable()
export class MessageService {
  constructor(private repository: MessageRepository) {}

  async getAllMessages() {
    const messages = await this.repository.getAllMessages();

    const novo: MessagesUi[] = messages.map(message => {
      return {
        ...message,
        formattedCreatedAt: message.createdAt.toLocaleString("pt-BR"),
        formattedReceiverNumber: message.receiverNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      }
    })

    return novo;
  }

  async decodeMessage(message: MessageProps): Promise<string> {
    if(!this._isValidMessageForm(message)) {
      throw new HttpException('Preencha todos os campos corretamente', 500);
    }

    if(message.text.length > 255) {
      throw new HttpException('O texto excede o limite de caracteres', 500);
    }

    let response = '';
    const isTextMessage = isNaN(Number(message.text.replace(/[^a-zA-Z ]/g, "")));

    if(isTextMessage) {
      response = message.telephoneEncodedText = this._decodeTextMessage(message.text);
    } else {
      message.telephoneEncodedText = message.text;
      response = message.text = this._decodeNumericMessage(message.text);
    }

    await this.repository.registerMessage(message);

    return response;
  }

  private _decodeTextMessage(message: string) {
    const cipherArray = [
      "2", "22", "222",
      "3", "33", "333",
      "4", "44", "444",
      "5", "55", "555",
      "6", "66", "666",
      "7", "77", "777", "7777",
      "8", "88", "888",
      "9", "99", "999", "9999"
    ];

    let decodedMessage = "";

    message.toUpperCase().split('').map((character, index) => {
      if(character === ' ') {
        decodedMessage += "0";
      } else {
        const nextPosition = message[index+1]?.charCodeAt(0) - 'A'.charCodeAt(0);
        const position = character.charCodeAt(0) - 'A'.charCodeAt(0);

        decodedMessage += cipherArray[position];

        if(cipherArray[nextPosition]?.includes(cipherArray[position])) {
          decodedMessage += "_";
        } 
      }
    });

    return decodedMessage;
  }

  private _decodeNumericMessage(message: string) {
    const cipherNums = [
      "", 
      "", 
      "ABC", 
      "DEF", 
      "GHI",
      "JKL", 
      "MNO", 
      "PQRS", 
      "TUV", 
      "WXYZ"
    ];
    const messageCharacters = message.split("");

    let decodedMessage = '';
    let count = 0;
  
    messageCharacters.map((character, index) => {
      if(character === '_') {
        return
      }
  
      let shouldStackMore = true;
      let isSevenOrNineNumbers = false;
      let isNotSeveneOrNineNumbers = false;
  
      if(character === '7' || character === '9') {
        isSevenOrNineNumbers = true;
      } else {
        isNotSeveneOrNineNumbers = true;
      }
  
      if(count === 2 && isNotSeveneOrNineNumbers) {
        shouldStackMore = false;
      }
  
      if(count === 3 && isSevenOrNineNumbers) {
        shouldStackMore = false;
      }
  
      if(character === messageCharacters[index + 1] && shouldStackMore) {
        count++;
        return
      }
  
      if(character === '0') {
        decodedMessage += " ";
        count = 0;
        return
      }
      
      if (character === '7' || character === '9') {
        decodedMessage += cipherNums[character.charCodeAt(0) - 48][count % 4];
      } else {
        decodedMessage += cipherNums[character.charCodeAt(0) - 48][count % 3];
      }
  
      count = 0;
    })
  
    return decodedMessage;
  }

  private _isValidMessageForm(message: MessageProps) {
    const { receiverNumber, sendNumber, text } = message

    if(!receiverNumber || !sendNumber || !text || !isNaN(Number(text))) {
      return false
    }

    return true
  }
}
