export function parseStickerMessage(message: any): any {
  const sticker = message.sticker || {};
  return {
    stickerMessage: {
      mediaId: sticker.id,
      mimeType: sticker.mime_type,
      sha256: sticker.sha256,
      animated: sticker.animated || false,
    },
  };
}
