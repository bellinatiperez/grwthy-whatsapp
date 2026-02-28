import {
  buildVCard,
  buildVCardArray,
  VCardContact,
} from './vcard-builder.util';

describe('vcard-builder.util', () => {
  const baseContact: VCardContact = {
    fullName: 'John Doe',
    phoneNumber: '5511912345678',
  };

  describe('buildVCard', () => {
    it('should build a basic vCard with name and phone', () => {
      const result = buildVCard(baseContact);

      expect(result).toContain('BEGIN:VCARD');
      expect(result).toContain('VERSION:3.0');
      expect(result).toContain('N:John Doe');
      expect(result).toContain('FN:John Doe');
      expect(result).toContain(
        'TEL;type=CELL;waid=5511912345678:+5511912345678',
      );
      expect(result).toContain('END:VCARD');
    });

    it('should include organization when provided', () => {
      const result = buildVCard({ ...baseContact, organization: 'Acme Inc' });
      expect(result).toContain('ORG:Acme Inc');
    });

    it('should include email when provided', () => {
      const result = buildVCard({ ...baseContact, email: 'john@acme.com' });
      expect(result).toContain('EMAIL:john@acme.com');
    });

    it('should include URL when provided', () => {
      const result = buildVCard({
        ...baseContact,
        url: 'https://acme.com',
      });
      expect(result).toContain('URL:https://acme.com');
    });

    it('should not include optional fields when not provided', () => {
      const result = buildVCard(baseContact);
      expect(result).not.toContain('ORG:');
      expect(result).not.toContain('EMAIL:');
      expect(result).not.toContain('URL:');
    });

    it('should strip non-digits from phone number in TEL field', () => {
      const result = buildVCard({
        ...baseContact,
        phoneNumber: '+55 (11) 91234-5678',
      });
      expect(result).toContain(
        'TEL;type=CELL;waid=5511912345678:+5511912345678',
      );
    });

    it('should include all optional fields together', () => {
      const result = buildVCard({
        ...baseContact,
        organization: 'Acme',
        email: 'john@acme.com',
        url: 'https://acme.com',
      });
      expect(result).toContain('ORG:Acme');
      expect(result).toContain('EMAIL:john@acme.com');
      expect(result).toContain('URL:https://acme.com');
    });
  });

  describe('buildVCardArray', () => {
    it('should build multiple vCards separated by newline', () => {
      const contacts: VCardContact[] = [
        { fullName: 'Alice', phoneNumber: '1111111111' },
        { fullName: 'Bob', phoneNumber: '2222222222' },
      ];

      const result = buildVCardArray(contacts);
      const cards = result.split('END:VCARD');

      // 2 cards + trailing empty string after last split
      expect(cards.length).toBe(3);
      expect(result).toContain('FN:Alice');
      expect(result).toContain('FN:Bob');
    });

    it('should handle single contact array', () => {
      const result = buildVCardArray([baseContact]);
      expect(result).toContain('BEGIN:VCARD');
      expect(result).toContain('END:VCARD');
    });
  });
});
