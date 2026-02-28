import { buildReactionMessage } from './reaction-message.builder';

describe('buildReactionMessage', () => {
  it('should build a reaction message', () => {
    const result = buildReactionMessage('5511999999999', 'wamid.abc123', '👍');

    expect(result).toEqual({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      type: 'reaction',
      to: '5511999999999',
      reaction: {
        message_id: 'wamid.abc123',
        emoji: '👍',
      },
    });
  });

  it('should strip non-digit characters from phone', () => {
    const result = buildReactionMessage('+55 11 999999999', 'wamid.abc', '❤️');
    expect(result.to).toBe('5511999999999');
  });

  it('should not include context (reactions have no quoted)', () => {
    const result = buildReactionMessage('5511999999999', 'wamid.abc', '😀');
    expect(result.context).toBeUndefined();
  });
});
