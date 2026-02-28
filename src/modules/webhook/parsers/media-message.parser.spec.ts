import { parseMediaMessage } from './media-message.parser';

describe('parseMediaMessage', () => {
  it('should parse an image message', () => {
    const message = {
      type: 'image',
      image: {
        id: 'media_123',
        mime_type: 'image/jpeg',
        sha256: 'abc123',
        caption: 'A photo',
      },
    };

    expect(parseMediaMessage(message)).toEqual({
      mediaId: 'media_123',
      mimeType: 'image/jpeg',
      sha256: 'abc123',
      caption: 'A photo',
      fileName: undefined,
      type: 'image',
    });
  });

  it('should parse a document with filename', () => {
    const message = {
      type: 'document',
      document: {
        id: 'doc_123',
        mime_type: 'application/pdf',
        sha256: 'xyz',
        filename: 'report.pdf',
      },
    };

    expect(parseMediaMessage(message)).toEqual({
      mediaId: 'doc_123',
      mimeType: 'application/pdf',
      sha256: 'xyz',
      caption: undefined,
      fileName: 'report.pdf',
      type: 'document',
    });
  });

  it('should handle missing media data gracefully', () => {
    const result = parseMediaMessage({ type: 'audio' });
    expect(result).toEqual({
      mediaId: undefined,
      mimeType: undefined,
      sha256: undefined,
      caption: undefined,
      fileName: undefined,
      type: 'audio',
    });
  });
});
