export function parseMediaMessage(message: any): any {
  const mediaData = message[message.type] || {};
  return {
    mediaId: mediaData.id,
    mimeType: mediaData.mime_type,
    sha256: mediaData.sha256,
    caption: mediaData.caption,
    fileName: mediaData.filename,
    type: message.type,
  };
}
