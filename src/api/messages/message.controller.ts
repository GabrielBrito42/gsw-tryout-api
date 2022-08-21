import { Controller, Post, Res, Body, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { Response } from 'express';

import type { MessageProps } from './dto'

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/get-messages')
  async getAllMessages(@Res() res: Response) {
    const response = await this.messageService.getAllMessages();
    return res.status(200).send(response);
  }

  @Post('/decode-message')
  async decodeMessage(@Body() message: MessageProps, @Res() res: Response) {
    const messageResponse = await this.messageService.decodeMessage(message);
    return res.status(201).send({ mensagem: messageResponse })
  }
}
