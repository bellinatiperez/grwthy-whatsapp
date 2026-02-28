import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { MessageSendService } from './message-send.service';
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
@Controller('message')
export class MessageSendController {
  constructor(private readonly messageSendService: MessageSendService) {}

  @Post('send-text/:instanceName')
  sendText(@Param('instanceName') instanceName: string, @Body() dto: SendTextDto) {
    return this.messageSendService.sendText(instanceName, dto);
  }

  @Post('send-media/:instanceName')
  sendMedia(@Param('instanceName') instanceName: string, @Body() dto: SendMediaDto) {
    return this.messageSendService.sendMedia(instanceName, dto);
  }

  @Post('send-audio/:instanceName')
  sendAudio(@Param('instanceName') instanceName: string, @Body() dto: SendAudioDto) {
    return this.messageSendService.sendAudio(instanceName, dto);
  }

  @Post('send-buttons/:instanceName')
  sendButtons(@Param('instanceName') instanceName: string, @Body() dto: SendButtonsDto) {
    return this.messageSendService.sendButtons(instanceName, dto);
  }

  @Post('send-list/:instanceName')
  sendList(@Param('instanceName') instanceName: string, @Body() dto: SendListDto) {
    return this.messageSendService.sendList(instanceName, dto);
  }

  @Post('send-template/:instanceName')
  sendTemplate(@Param('instanceName') instanceName: string, @Body() dto: SendTemplateDto) {
    return this.messageSendService.sendTemplate(instanceName, dto);
  }

  @Post('send-location/:instanceName')
  sendLocation(@Param('instanceName') instanceName: string, @Body() dto: SendLocationDto) {
    return this.messageSendService.sendLocation(instanceName, dto);
  }

  @Post('send-contact/:instanceName')
  sendContact(@Param('instanceName') instanceName: string, @Body() dto: SendContactDto) {
    return this.messageSendService.sendContact(instanceName, dto);
  }

  @Post('send-reaction/:instanceName')
  sendReaction(@Param('instanceName') instanceName: string, @Body() dto: SendReactionDto) {
    return this.messageSendService.sendReaction(instanceName, dto);
  }
}
