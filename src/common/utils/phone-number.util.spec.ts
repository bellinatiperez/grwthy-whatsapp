import { createJid, stripPhoneNumber } from './phone-number.util';

describe('phone-number.util', () => {
  describe('createJid', () => {
    it('should return empty string for empty input', () => {
      expect(createJid('')).toBe('');
    });

    it('should return as-is if already a JID (@s.whatsapp.net)', () => {
      expect(createJid('5511999999999@s.whatsapp.net')).toBe(
        '5511999999999@s.whatsapp.net',
      );
    });

    it('should return as-is if already a group JID (@g.us)', () => {
      expect(createJid('120363000000000000@g.us')).toBe(
        '120363000000000000@g.us',
      );
    });

    it('should return as-is if already a broadcast JID', () => {
      expect(createJid('status@broadcast')).toBe('status@broadcast');
    });

    it('should return as-is if already a lid JID', () => {
      expect(createJid('12345@lid')).toBe('12345@lid');
    });

    it('should create group JID for numbers with 18+ digits', () => {
      const longNumber = '120363000000000000';
      expect(createJid(longNumber)).toBe(`${longNumber}@g.us`);
    });

    it('should create individual JID for regular numbers', () => {
      expect(createJid('14155551234')).toBe('14155551234@s.whatsapp.net');
    });

    it('should strip non-digit characters before processing', () => {
      expect(createJid('+1 (415) 555-1234')).toBe(
        '14155551234@s.whatsapp.net',
      );
    });

    it('should strip port-like patterns (:digit) from number', () => {
      expect(createJid('5511999999999:1')).toBe(
        '5511999999999@s.whatsapp.net',
      );
    });

    // Brazil (55) formatting
    describe('Brazil numbers', () => {
      it('should remove 9th digit for DDD >= 31 when number has 13 digits', () => {
        // 55 + 31 + 9XXXXXXXX (13 digits) → 55 + 31 + XXXXXXXX (12 digits)
        expect(createJid('5531912345678')).toBe(
          '553112345678@s.whatsapp.net',
        );
      });

      it('should keep 9th digit for DDD < 31 when number has 13 digits', () => {
        // 55 + 11 + 9XXXXXXXX should remain as-is
        expect(createJid('5511912345678')).toBe(
          '5511912345678@s.whatsapp.net',
        );
      });

      it('should not modify 12-digit BR numbers', () => {
        expect(createJid('551112345678')).toBe('551112345678@s.whatsapp.net');
      });
    });

    // Mexico (52) formatting
    describe('Mexico numbers', () => {
      it('should remove "1" after country code for 13-digit numbers', () => {
        // 52 + 1 + XXXXXXXXXX (13 digits) → 52 + XXXXXXXXXX (12 digits)
        expect(createJid('5211234567890')).toBe(
          '521234567890@s.whatsapp.net',
        );
      });

      it('should not modify 12-digit MX numbers', () => {
        expect(createJid('521234567890')).toBe('521234567890@s.whatsapp.net');
      });
    });

    // Argentina (54) formatting
    describe('Argentina numbers', () => {
      it('should keep 13-digit AR number that already has 9', () => {
        // 54 + 9 + XXXXXXXXXX (13 digits) → unchanged
        expect(createJid('5491123456789')).toBe(
          '5491123456789@s.whatsapp.net',
        );
      });

      it('should insert 9 for 12-digit AR numbers', () => {
        // 54 + XXXXXXXXXX (12 digits) → 54 + 9 + XXXXXXXXXX (13 digits)
        expect(createJid('541123456789')).toBe(
          '5491123456789@s.whatsapp.net',
        );
      });
    });
  });

  describe('stripPhoneNumber', () => {
    it('should remove all non-digit characters', () => {
      expect(stripPhoneNumber('+55 (11) 91234-5678')).toBe('5511912345678');
    });

    it('should return digits unchanged', () => {
      expect(stripPhoneNumber('5511912345678')).toBe('5511912345678');
    });

    it('should return empty string for non-digit input', () => {
      expect(stripPhoneNumber('abc')).toBe('');
    });
  });
});
