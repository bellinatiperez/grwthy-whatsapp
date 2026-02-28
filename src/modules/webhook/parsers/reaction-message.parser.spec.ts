import { parseReactionMessage } from './reaction-message.parser';

describe('parseReactionMessage', () => {
  it('should parse reaction with message id and emoji', () => {
    const message = {
      reaction: { message_id: 'wamid.abc123', emoji: '👍' },
    };

    expect(parseReactionMessage(message)).toEqual({
      reactionMessage: {
        key: { id: 'wamid.abc123' },
        text: '👍',
      },
    });
  });

  it('should handle missing reaction gracefully', () => {
    const result = parseReactionMessage({});
    expect(result.reactionMessage.key).toEqual({ id: undefined });
    expect(result.reactionMessage.text).toBeUndefined();
  });
});
