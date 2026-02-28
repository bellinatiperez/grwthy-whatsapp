import { MetaSendMessagePayload } from '../../../shared/meta-api/meta-api.types';
import { stripPhoneNumber } from '../../../common/utils/phone-number.util';

export function buildMediaMessage(
  to: string,
  mediaType: 'image' | 'document' | 'video' | 'audio',
  mediaId: string,
  mediaIdType: 'id' | 'link',
  options?: {
    caption?: string;
    fileName?: string;
    quotedMessageId?: string;
  },
): MetaSendMessagePayload {
  const mediaObject: Record<string, any> = {
    [mediaIdType]: mediaId,
  };

  if (mediaType !== 'audio' && options?.caption) {
    mediaObject.caption = options.caption;
  }

  if (mediaType === 'document' && options?.fileName) {
    mediaObject.filename = options.fileName;
  }

  const payload: MetaSendMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: mediaType,
    to: stripPhoneNumber(to),
    [mediaType]: mediaObject,
  };

  if (options?.quotedMessageId) {
    payload.context = { message_id: options.quotedMessageId };
  }

  return payload;
}
