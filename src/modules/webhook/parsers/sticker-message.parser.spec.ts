import { parseStickerMessage } from './sticker-message.parser';

describe('parseStickerMessage', () => {
  it('should parse sticker data', () => {
    const message = {
      sticker: {
        id: 'sticker_123',
        mime_type: 'image/webp',
        sha256: 'hash123',
        animated: true,
      },
    };

    expect(parseStickerMessage(message)).toEqual({
      stickerMessage: {
        mediaId: 'sticker_123',
        mimeType: 'image/webp',
        sha256: 'hash123',
        animated: true,
      },
    });
  });

  it('should default animated to false when not provided', () => {
    const message = {
      sticker: { id: 's1', mime_type: 'image/webp', sha256: 'h' },
    };

    expect(parseStickerMessage(message).stickerMessage.animated).toBe(false);
  });

  it('should handle missing sticker data', () => {
    const result = parseStickerMessage({});
    expect(result.stickerMessage).toEqual({
      mediaId: undefined,
      mimeType: undefined,
      sha256: undefined,
      animated: false,
    });
  });
});
