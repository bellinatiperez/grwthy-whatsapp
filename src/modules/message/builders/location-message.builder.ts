import { MetaSendMessagePayload } from '../../../shared/meta-api/meta-api.types';
import { stripPhoneNumber } from '../../../common/utils/phone-number.util';

export function buildLocationMessage(
  to: string,
  latitude: number,
  longitude: number,
  options?: { name?: string; address?: string; quotedMessageId?: string },
): MetaSendMessagePayload {
  const payload: MetaSendMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'location',
    to: stripPhoneNumber(to),
    location: {
      longitude,
      latitude,
      ...(options?.name && { name: options.name }),
      ...(options?.address && { address: options.address }),
    },
  };

  if (options?.quotedMessageId) {
    payload.context = { message_id: options.quotedMessageId };
  }

  return payload;
}
