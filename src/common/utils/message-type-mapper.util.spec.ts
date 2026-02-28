import { mapMetaTypeToInternal } from './message-type-mapper.util';

describe('message-type-mapper.util', () => {
  it.each([
    ['text', 'conversation'],
    ['image', 'imageMessage'],
    ['video', 'videoMessage'],
    ['audio', 'audioMessage'],
    ['document', 'documentMessage'],
    ['sticker', 'stickerMessage'],
    ['location', 'locationMessage'],
    ['contacts', 'contactMessage'],
    ['interactive', 'interactiveMessage'],
    ['button', 'interactiveMessage'],
    ['reaction', 'reactionMessage'],
    ['template', 'templateMessage'],
  ])('should map "%s" to "%s"', (metaType, expected) => {
    expect(mapMetaTypeToInternal(metaType)).toBe(expected);
  });

  it('should return the original type if not in the map', () => {
    expect(mapMetaTypeToInternal('unknown_type')).toBe('unknown_type');
  });
});
