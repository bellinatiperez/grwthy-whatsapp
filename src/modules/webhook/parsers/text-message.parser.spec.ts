import { parseTextMessage } from './text-message.parser';

describe('parseTextMessage', () => {
  it('should extract text body from message', () => {
    const result = parseTextMessage({ text: { body: 'Hello World' } });
    expect(result).toEqual({ conversation: 'Hello World' });
  });

  it('should return empty string when text body is missing', () => {
    const result = parseTextMessage({});
    expect(result).toEqual({ conversation: '' });
  });

  it('should return empty string when text object exists but body is missing', () => {
    const result = parseTextMessage({ text: {} });
    expect(result).toEqual({ conversation: '' });
  });
});
