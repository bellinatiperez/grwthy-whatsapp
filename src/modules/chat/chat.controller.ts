import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ChatService } from './chat.service';

@UseGuards(ApiKeyGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:instanceName')
  findMessages(@Param('instanceName') instanceName: string) {
    return this.chatService.findMessages(instanceName);
  }

  @Get('conversations/:instanceName')
  findConversations(@Param('instanceName') instanceName: string) {
    return this.chatService.findConversations(instanceName);
  }

  @Put('read/:instanceName/:remoteJid')
  markAsRead(
    @Param('instanceName') instanceName: string,
    @Param('remoteJid') remoteJid: string,
  ) {
    return this.chatService.markAsRead(instanceName, remoteJid);
  }
}
