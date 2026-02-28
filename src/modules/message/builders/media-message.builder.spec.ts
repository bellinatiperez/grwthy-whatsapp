import { buildMediaMessage } from './media-message.builder';

describe('buildMediaMessage', () => {
  it('should build an image message with media id', () => {
    const result = buildMediaMessage('5511999999999', 'image', 'media_123', 'id');

    expect(result).toEqual({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      type: 'image',
      to: '5511999999999',
      image: { id: 'media_123' },
    });
  });

  it('should build a document message with link', () => {
    const result = buildMediaMessage(
      '5511999999999',
      'document',
      'https://example.com/doc.pdf',
      'link',
      { fileName: 'report.pdf' },
    );

    expect(result.document).toEqual({
      link: 'https://example.com/doc.pdf',
      filename: 'report.pdf',
    });
  });

  it('should include caption for non-audio types', () => {
    const result = buildMediaMessage('5511999999999', 'image', 'id_123', 'id', {
      caption: 'A photo',
    });

    expect(result.image.caption).toBe('A photo');
  });

  it('should not include caption for audio type', () => {
    const result = buildMediaMessage('5511999999999', 'audio', 'id_123', 'id', {
      caption: 'ignored',
    });

    expect(result.audio.caption).toBeUndefined();
  });

  it('should only include filename for document type', () => {
    const result = buildMediaMessage('5511999999999', 'image', 'id_123', 'id', {
      fileName: 'ignored.jpg',
    });

    expect(result.image.filename).toBeUndefined();
  });

  it('should include context for quoted messages', () => {
    const result = buildMediaMessage('5511999999999', 'video', 'id_123', 'id', {
      quotedMessageId: 'wamid.abc',
    });

    expect(result.context).toEqual({ message_id: 'wamid.abc' });
  });
});
