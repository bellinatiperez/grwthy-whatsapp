import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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
}
