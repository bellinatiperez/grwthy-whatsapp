import { Injectable, Logger } from '@nestjs/common';
import { MessagePersistenceService } from '../../message/message-persistence.service';
import { WebhookDispatchService } from '../../webhook-dispatch/webhook-dispatch.service';
import { MetaEvent } from '../../../common/constants/meta-events.constant';
import { mapMetaTypeToInternal } from '../../../common/utils/message-type-mapper.util';
import { Instance } from '../../../database/schema/schema';
import { parseTextMessage } from '../parsers/text-message.parser';
import { parseMediaMessage } from '../parsers/media-message.parser';
import { parseLocationMessage } from '../parsers/location-message.parser';
import { parseContactMessage } from '../parsers/contact-message.parser';
import { parseReactionMessage } from '../parsers/reaction-message.parser';
import { parseInteractiveMessage } from '../parsers/interactive-message.parser';
import { parseStickerMessage } from '../parsers/sticker-message.parser';

const MESSAGE_PARSERS: Record<string, (msg: any) => any> = {
  text: parseTextMessage,
  image: parseMediaMessage,
  video: parseMediaMessage,
  audio: parseMediaMessage,
  document: parseMediaMessage,
  sticker: parseStickerMessage,
  location: parseLocationMessage,
  contacts: parseContactMessage,
  reaction: parseReactionMessage,
  interactive: parseInteractiveMessage,
  button: parseInteractiveMessage,
};

@Injectable()
export class IncomingMessageProcessor {
  private readonly logger = new Logger(IncomingMessageProcessor.name);

  constructor(
    private readonly persistence: MessagePersistenceService,
    private readonly webhookDispatch: WebhookDispatchService,
  ) {}

  async process(instance: Instance, message: any, contact?: any): Promise<void> {
    const parser = MESSAGE_PARSERS[message.type];
    if (!parser) {
      this.logger.warn(`Unsupported message type: ${message.type}`);
      return;
    }

    const parsedContent = parser(message);

    const saved = await this.persistence.saveIncomingMessage({
      metaMessageId: message.id,
      fromNumber: message.from,
      pushName: contact?.profile?.name,
      message: parsedContent,
      messageType: mapMetaTypeToInternal(message.type),
      messageTimestamp: parseInt(message.timestamp, 10),
      instanceId: instance.id,
      fromMe: false,
    });

    await this.webhookDispatch.dispatch(instance.id, MetaEvent.MESSAGES_UPSERT, saved);
  }
}
