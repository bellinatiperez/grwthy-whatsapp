import { parseContactMessage } from './contact-message.parser';

describe('parseContactMessage', () => {
  it('should parse contacts with name, phone, email and org', () => {
    const message = {
      contacts: [
        {
          name: { formatted_name: 'John Doe' },
          phones: [{ phone: '+5511999999999' }],
          emails: [{ email: 'john@test.com' }],
          org: { company: 'Acme' },
        },
      ],
    };

    expect(parseContactMessage(message)).toEqual({
      contacts: [
        {
          name: 'John Doe',
          phones: ['+5511999999999'],
          emails: ['john@test.com'],
          org: 'Acme',
        },
      ],
    });
  });

  it('should handle multiple contacts', () => {
    const message = {
      contacts: [
        { name: { formatted_name: 'A' }, phones: [{ phone: '1' }] },
        { name: { formatted_name: 'B' }, phones: [{ phone: '2' }] },
      ],
    };

    expect(parseContactMessage(message).contacts).toHaveLength(2);
  });

  it('should handle missing contacts array', () => {
    expect(parseContactMessage({})).toEqual({ contacts: [] });
  });
});
