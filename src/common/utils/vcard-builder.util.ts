export interface VCardContact {
  fullName: string;
  phoneNumber: string;
  organization?: string;
  email?: string;
  url?: string;
}

export function buildVCard(contact: VCardContact): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${contact.fullName}`,
    `FN:${contact.fullName}`,
    `TEL;type=CELL;waid=${contact.phoneNumber.replace(/\D/g, '')}:+${contact.phoneNumber.replace(/\D/g, '')}`,
  ];

  if (contact.organization) {
    lines.push(`ORG:${contact.organization}`);
  }
  if (contact.email) {
    lines.push(`EMAIL:${contact.email}`);
  }
  if (contact.url) {
    lines.push(`URL:${contact.url}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

export function buildVCardArray(contacts: VCardContact[]): string {
  return contacts.map(buildVCard).join('\n');
}
