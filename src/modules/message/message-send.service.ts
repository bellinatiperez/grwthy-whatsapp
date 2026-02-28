import { Injectable, Logger } from '@nestjs/common';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { InstanceService } from '../instance/instance.service';
import { MessagePersistenceService } from './message-persistence.service';
import { WebhookDispatchService } from '../webhook-dispatch/webhook-dispatch.service';
import { MetaEvent } from '../../common/constants/meta-events.constant';
import { mapMetaTypeToInternal } from '../../common/utils/message-type-mapper.util';
import { MetaSendMessagePayload } from '../../shared/meta-api/meta-api.types';
import { StorageService } from '../../storage/storage.service';
import { isURL } from 'class-validator';
import FormData from 'form-data';
import * as mimeTypes from 'mime-types';

import { buildTextMessage } from './builders/text-message.builder';
import { buildMediaMessage } from './builders/media-message.builder';
import { buildButtonMessage, buildListMessage } from './builders/interactive-message.builder';
import { buildTemplateMessage } from './builders/template-message.builder';
import { buildLocationMessage } from './builders/location-message.builder';
import { buildContactMessage } from './builders/contact-message.builder';
import { buildReactionMessage } from './builders/reaction-message.builder';

import { SendTextDto } from './dto/send-text.dto';
import { SendMediaDto } from './dto/send-media.dto';
import { SendAudioDto } from './dto/send-audio.dto';
import { SendButtonsDto } from './dto/send-buttons.dto';
import { SendListDto } from './dto/send-list.dto';
import { SendTemplateDto } from './dto/send-template.dto';
import { SendLocationDto } from './dto/send-location.dto';
import { SendContactDto } from './dto/send-contact.dto';
import { SendReactionDto } from './dto/send-reaction.dto';

@Injectable()
export class MessageSendService {
  private readonly logger = new Logger(MessageSendService.name);

  constructor(
    private readonly metaApiClient: MetaApiClient,
    private readonly instanceService: InstanceService,
    private readonly persistence: MessagePersistenceService,
    private readonly webhookDispatch: WebhookDispatchService,
    private readonly storageService: StorageService,
  ) {}

  private async sendAndPersist(
    instanceName: string,
    payload: MetaSendMessagePayload,
    originalMessage: Record<string, any>,
    webhookUrl?: string,
  ) {
    const instance = await this.instanceService.findByName(instanceName);

    const result = await this.metaApiClient.sendMessage(
      instance.phoneNumberId,
      instance.accessToken,
      payload,
    );

    const saved = await this.persistence.saveOutgoingMessage({
      metaMessageId: result.messages[0].id,
      recipientNumber: payload.to,
      message: originalMessage,
      messageType: mapMetaTypeToInternal(payload.type),
      instanceId: instance.id,
      webhookUrl,
    });

    await this.webhookDispatch.dispatch(instance.id, MetaEvent.SEND_MESSAGE, saved);
    return saved;
  }

  async sendText(instanceName: string, dto: SendTextDto) {
    const payload = buildTextMessage(dto.number, dto.text, {
      linkPreview: dto.linkPreview,
      quotedMessageId: dto.quoted?.id,
    });
    return this.sendAndPersist(instanceName, payload, { conversation: dto.text }, dto.webhookUrl);
  }

  async sendMedia(instanceName: string, dto: SendMediaDto) {
    const instance = await this.instanceService.findByName(instanceName);
    const { mediaId, mediaIdType } = await this.resolveMedia(instance, dto.media, dto.mimetype, dto.fileName);

    const payload = buildMediaMessage(dto.number, dto.mediatype, mediaId, mediaIdType, {
      caption: dto.caption,
      fileName: dto.fileName,
      quotedMessageId: dto.quoted?.id,
    });

    const result = await this.metaApiClient.sendMessage(instance.phoneNumberId, instance.accessToken, payload);

    const saved = await this.persistence.saveOutgoingMessage({
      metaMessageId: result.messages[0].id,
      recipientNumber: dto.number,
      message: { media: dto.media, mediaType: dto.mediatype, caption: dto.caption },
      messageType: mapMetaTypeToInternal(dto.mediatype),
      instanceId: instance.id,
      webhookUrl: dto.webhookUrl,
    });

    await this.webhookDispatch.dispatch(instance.id, MetaEvent.SEND_MESSAGE, saved);
    return saved;
  }

  async sendAudio(instanceName: string, dto: SendAudioDto) {
    const instance = await this.instanceService.findByName(instanceName);
    const { mediaId, mediaIdType } = await this.resolveMedia(instance, dto.audio);

    const payload = buildMediaMessage(dto.number, 'audio', mediaId, mediaIdType, {
      quotedMessageId: dto.quoted?.id,
    });

    const result = await this.metaApiClient.sendMessage(instance.phoneNumberId, instance.accessToken, payload);

    const saved = await this.persistence.saveOutgoingMessage({
      metaMessageId: result.messages[0].id,
      recipientNumber: dto.number,
      message: { audio: dto.audio },
      messageType: 'audioMessage',
      instanceId: instance.id,
      webhookUrl: dto.webhookUrl,
    });

    await this.webhookDispatch.dispatch(instance.id, MetaEvent.SEND_MESSAGE, saved);
    return saved;
  }

  async sendButtons(instanceName: string, dto: SendButtonsDto) {
    const payload = buildButtonMessage(
      dto.number,
      dto.title,
      dto.buttons.map((b) => ({ type: 'reply', reply: { id: b.reply.id, title: b.reply.title } })),
      { quotedMessageId: dto.quoted?.id },
    );
    return this.sendAndPersist(instanceName, payload, { buttons: dto.buttons, text: dto.title }, dto.webhookUrl);
  }

  async sendList(instanceName: string, dto: SendListDto) {
    const payload = buildListMessage(
      dto.number,
      dto.title,
      dto.description || dto.title,
      dto.buttonText,
      dto.sections,
      { footerText: dto.footerText, quotedMessageId: dto.quoted?.id },
    );
    return this.sendAndPersist(instanceName, payload, { listMessage: dto }, dto.webhookUrl);
  }

  async sendTemplate(instanceName: string, dto: SendTemplateDto) {
    const payload = buildTemplateMessage(dto.number, dto.name, dto.language, dto.components, {
      quotedMessageId: dto.quoted?.id,
    });
    return this.sendAndPersist(instanceName, payload, { template: dto }, dto.webhookUrl);
  }

  async sendLocation(instanceName: string, dto: SendLocationDto) {
    const payload = buildLocationMessage(dto.number, dto.latitude, dto.longitude, {
      name: dto.name,
      address: dto.address,
      quotedMessageId: dto.quoted?.id,
    });
    return this.sendAndPersist(instanceName, payload, {
      locationMessage: { degreesLatitude: dto.latitude, degreesLongitude: dto.longitude },
    }, dto.webhookUrl);
  }

  async sendContact(instanceName: string, dto: SendContactDto) {
    const payload = buildContactMessage(dto.number, dto.contact, { quotedMessageId: dto.quoted?.id });
    return this.sendAndPersist(instanceName, payload, { contacts: dto.contact }, dto.webhookUrl);
  }

  async sendReaction(instanceName: string, dto: SendReactionDto) {
    const payload = buildReactionMessage(dto.number, dto.messageId, dto.reaction);
    return this.sendAndPersist(instanceName, payload, {
      reactionMessage: { key: { id: dto.messageId }, text: dto.reaction },
    });
  }

  private async resolveMedia(
    instance: { phoneNumberId: string; accessToken: string },
    media: string,
    mimetype?: string,
    fileName?: string,
  ): Promise<{ mediaId: string; mediaIdType: 'id' | 'link' }> {
    if (isURL(media)) {
      return { mediaId: media, mediaIdType: 'link' };
    }

    const buffer = Buffer.from(media, 'base64');
    const resolvedMimetype = mimetype || mimeTypes.lookup(fileName || '') || 'application/octet-stream';

    const formData = new FormData();
    formData.append('file', buffer, {
      filename: fileName || `media.${mimeTypes.extension(resolvedMimetype as string) || 'bin'}`,
      contentType: resolvedMimetype as string,
    });
    formData.append('messaging_product', 'whatsapp');
    formData.append('type', resolvedMimetype);

    const result = await this.metaApiClient.uploadMedia(instance.phoneNumberId, instance.accessToken, formData);
    return { mediaId: result.id, mediaIdType: 'id' };
  }
}
