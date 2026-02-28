import { MetaSendMessagePayload } from '../../../shared/meta-api/meta-api.types';
import { stripPhoneNumber } from '../../../common/utils/phone-number.util';

export function buildButtonMessage(
  to: string,
  bodyText: string,
  buttons: Array<{ type: string; reply: { id: string; title: string } }>,
  options?: { quotedMessageId?: string },
): MetaSendMessagePayload {
  const payload: MetaSendMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'interactive',
    to: stripPhoneNumber(to),
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: { buttons },
    },
  };

  if (options?.quotedMessageId) {
    payload.context = { message_id: options.quotedMessageId };
  }

  return payload;
}

export function buildListMessage(
  to: string,
  title: string,
  description: string,
  buttonText: string,
  sections: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>,
  options?: { footerText?: string; quotedMessageId?: string },
): MetaSendMessagePayload {
  const payload: MetaSendMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'interactive',
    to: stripPhoneNumber(to),
    interactive: {
      type: 'list',
      header: { type: 'text', text: title },
      body: { text: description },
      ...(options?.footerText && { footer: { text: options.footerText } }),
      action: { button: buttonText, sections },
    },
  };

  if (options?.quotedMessageId) {
    payload.context = { message_id: options.quotedMessageId };
  }

  return payload;
}
