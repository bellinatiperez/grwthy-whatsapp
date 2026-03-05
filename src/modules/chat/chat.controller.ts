import { Controller, Get, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountContextInterceptor } from '../../common/interceptors/business-account-context.interceptor';
import { ResolvedInstance } from '../../common/decorators/resolved-instance.decorator';
import { ChatService } from './chat.service';
import type { Instance } from '../../database/schema/schema';

@UseGuards(ApiKeyGuard)
@UseInterceptors(BusinessAccountContextInterceptor)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:id')
  findMessages(@ResolvedInstance() instance: Instance) {
    return this.chatService.findMessages(instance);
  }

  @Get('conversations/:id')
  findConversations(@ResolvedInstance() instance: Instance) {
    return this.chatService.findConversations(instance);
  }

  @Put('read/:id/:remoteJid')
  markAsRead(
    @ResolvedInstance() instance: Instance,
    @Param('remoteJid') remoteJid: string,
  ) {
    return this.chatService.markAsRead(instance, remoteJid);
  }
}
