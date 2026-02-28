import { MetaSendMessagePayload } from '../../../shared/meta-api/meta-api.types';
import { stripPhoneNumber } from '../../../common/utils/phone-number.util';

export function buildTemplateMessage(
  to: string,
  templateName: string,
  language: string,
  components?: any[],
  options?: { quotedMessageId?: string },
): MetaSendMessagePayload {
  const payload: MetaSendMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'template',
    to: stripPhoneNumber(to),
    template: {
      name: templateName,
      language: { code: language },
      ...(components && { components }),
    },
  };

  if (options?.quotedMessageId) {
    payload.context = { message_id: options.quotedMessageId };
  }

  return payload;
}
