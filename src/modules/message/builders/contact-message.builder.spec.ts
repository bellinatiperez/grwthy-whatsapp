import { buildContactMessage } from './contact-message.builder';

describe('buildContactMessage', () => {
  const contacts = [
    { fullName: 'John Doe', phoneNumber: '+5511999999999' },
  ];

  it('should build a contact message with formatted name parts', () => {
    const result = buildContactMessage('5511999999999', contacts);

    expect(result.type).toBe('contacts');
    expect(result.contacts[0]).toEqual({
      name: {
        formatted_name: 'John Doe',
        first_name: 'John',
        last_name: 'Doe',
      },
      phones: [{ phone: '+5511999999999', type: 'CELL' }],
    });
  });

  it('should handle single-name contacts (no last name)', () => {
    const result = buildContactMessage('5511999999999', [
      { fullName: 'Alice', phoneNumber: '1111111111' },
    ]);

    expect(result.contacts[0].name.first_name).toBe('Alice');
    expect(result.contacts[0].name.last_name).toBeUndefined();
  });

  it('should include email when provided', () => {
    const result = buildContactMessage('5511999999999', [
      { fullName: 'John', phoneNumber: '123', email: 'john@test.com' },
    ]);

    expect(result.contacts[0].emails).toEqual([
      { email: 'john@test.com', type: 'WORK' },
    ]);
  });

  it('should include organization when provided', () => {
    const result = buildContactMessage('5511999999999', [
      { fullName: 'John', phoneNumber: '123', organization: 'Acme' },
    ]);

    expect(result.contacts[0].org).toEqual({ company: 'Acme' });
  });

  it('should include url when provided', () => {
    const result = buildContactMessage('5511999999999', [
      { fullName: 'John', phoneNumber: '123', url: 'https://acme.com' },
    ]);

    expect(result.contacts[0].urls).toEqual([
      { url: 'https://acme.com', type: 'WORK' },
    ]);
  });

  it('should handle multiple contacts', () => {
    const result = buildContactMessage('5511999999999', [
      { fullName: 'Alice', phoneNumber: '111' },
      { fullName: 'Bob', phoneNumber: '222' },
    ]);

    expect(result.contacts).toHaveLength(2);
  });

  it('should include context for quoted messages', () => {
    const result = buildContactMessage('5511999999999', contacts, {
      quotedMessageId: 'wamid.abc',
    });

    expect(result.context).toEqual({ message_id: 'wamid.abc' });
  });
});
