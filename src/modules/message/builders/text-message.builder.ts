import { MetaSendMessagePayload } from '../../../shared/meta-api/meta-api.types';
import { stripPhoneNumber } from '../../../common/utils/phone-number.util';

export function buildTextMessage(
  to: string,
  text: string,
  options?: { linkPreview?: boolean; quotedMessageId?: string },
): MetaSendMessagePayload {
  const payload: MetaSendMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'text',
    to: stripPhoneNumber(to),
    text: {
      body: text,
      preview_url: options?.linkPreview ?? false,
    },
  };

  if (options?.quotedMessageId) {
    payload.context = { message_id: options.quotedMessageId };
  }

  return payload;
}
