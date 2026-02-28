import { buildTextMessage } from './text-message.builder';

describe('buildTextMessage', () => {
  it('should build a basic text message', () => {
    const result = buildTextMessage('5511999999999', 'Hello');

    expect(result).toEqual({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      type: 'text',
      to: '5511999999999',
      text: { body: 'Hello', preview_url: false },
    });
  });

  it('should enable link preview when specified', () => {
    const result = buildTextMessage('5511999999999', 'Check https://example.com', {
      linkPreview: true,
    });

    expect(result.text.preview_url).toBe(true);
  });

  it('should include context for quoted messages', () => {
    const result = buildTextMessage('5511999999999', 'Reply', {
      quotedMessageId: 'wamid.abc123',
    });

    expect(result.context).toEqual({ message_id: 'wamid.abc123' });
  });

  it('should not include context when no quotedMessageId', () => {
    const result = buildTextMessage('5511999999999', 'Hello');
    expect(result.context).toBeUndefined();
  });

  it('should strip non-digit characters from phone number', () => {
    const result = buildTextMessage('+55 (11) 99999-9999', 'Hello');
    expect(result.to).toBe('5511999999999');
  });
});
