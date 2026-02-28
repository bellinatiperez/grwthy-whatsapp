import { MetaSendMessagePayload } from '../../../shared/meta-api/meta-api.types';
import { stripPhoneNumber } from '../../../common/utils/phone-number.util';

interface ContactInput {
  fullName: string;
  phoneNumber: string;
  organization?: string;
  email?: string;
  url?: string;
}

export function buildContactMessage(
  to: string,
  contacts: ContactInput[],
  options?: { quotedMessageId?: string },
): MetaSendMessagePayload {
  const formattedContacts = contacts.map((c) => ({
    name: {
      formatted_name: c.fullName,
      first_name: c.fullName.split(' ')[0],
      last_name: c.fullName.split(' ').slice(1).join(' ') || undefined,
    },
    phones: [{ phone: c.phoneNumber, type: 'CELL' }],
    ...(c.email && { emails: [{ email: c.email, type: 'WORK' }] }),
    ...(c.organization && { org: { company: c.organization } }),
    ...(c.url && { urls: [{ url: c.url, type: 'WORK' }] }),
  }));

  const payload: MetaSendMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'contacts',
    to: stripPhoneNumber(to),
    contacts: formattedContacts,
  };

  if (options?.quotedMessageId) {
    payload.context = { message_id: options.quotedMessageId };
  }

  return payload;
}
