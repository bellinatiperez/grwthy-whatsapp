import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountContextInterceptor } from '../../common/interceptors/business-account-context.interceptor';
import { ResolvedInstance } from '../../common/decorators/resolved-instance.decorator';
import { MessageSendService } from './message-send.service';
import type { Instance } from '../../database/schema/schema';
import { SendTextDto } from './dto/send-text.dto';
import { SendMediaDto } from './dto/send-media.dto';
import { SendAudioDto } from './dto/send-audio.dto';
import { SendButtonsDto } from './dto/send-buttons.dto';
import { SendListDto } from './dto/send-list.dto';
import { SendTemplateDto } from './dto/send-template.dto';
import { SendLocationDto } from './dto/send-location.dto';
import { SendContactDto } from './dto/send-contact.dto';
import { SendReactionDto } from './dto/send-reaction.dto';

@UseGuards(ApiKeyGuard)
@UseInterceptors(BusinessAccountContextInterceptor)
@Controller('message')
export class MessageSendController {
  constructor(private readonly messageSendService: MessageSendService) {}

  @Post('send-text/:instanceName')
  sendText(@ResolvedInstance() instance: Instance, @Body() dto: SendTextDto) {
    return this.messageSendService.sendText(instance, dto);
  }

  @Post('send-media/:instanceName')
  sendMedia(@ResolvedInstance() instance: Instance, @Body() dto: SendMediaDto) {
    return this.messageSendService.sendMedia(instance, dto);
  }

  @Post('send-audio/:instanceName')
  sendAudio(@ResolvedInstance() instance: Instance, @Body() dto: SendAudioDto) {
    return this.messageSendService.sendAudio(instance, dto);
  }

  @Post('send-buttons/:instanceName')
  sendButtons(@ResolvedInstance() instance: Instance, @Body() dto: SendButtonsDto) {
    return this.messageSendService.sendButtons(instance, dto);
  }

  @Post('send-list/:instanceName')
  sendList(@ResolvedInstance() instance: Instance, @Body() dto: SendListDto) {
    return this.messageSendService.sendList(instance, dto);
  }

  @Post('send-template/:instanceName')
  sendTemplate(@ResolvedInstance() instance: Instance, @Body() dto: SendTemplateDto) {
    return this.messageSendService.sendTemplate(instance, dto);
  }

  @Post('send-location/:instanceName')
  sendLocation(@ResolvedInstance() instance: Instance, @Body() dto: SendLocationDto) {
    return this.messageSendService.sendLocation(instance, dto);
  }

  @Post('send-contact/:instanceName')
  sendContact(@ResolvedInstance() instance: Instance, @Body() dto: SendContactDto) {
    return this.messageSendService.sendContact(instance, dto);
  }

  @Post('send-reaction/:instanceName')
  sendReaction(@ResolvedInstance() instance: Instance, @Body() dto: SendReactionDto) {
    return this.messageSendService.sendReaction(instance, dto);
  }
}
