import { MetaSendMessagePayload } from '../../../shared/meta-api/meta-api.types';
import { stripPhoneNumber } from '../../../common/utils/phone-number.util';

export function buildReactionMessage(
  to: string,
  messageId: string,
  emoji: string,
): MetaSendMessagePayload {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'reaction',
    to: stripPhoneNumber(to),
    reaction: {
      message_id: messageId,
      emoji,
    },
  };
}
