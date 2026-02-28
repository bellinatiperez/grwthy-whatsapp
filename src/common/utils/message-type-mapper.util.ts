const TYPE_MAP: Record<string, string> = {
  text: 'conversation',
  image: 'imageMessage',
  video: 'videoMessage',
  audio: 'audioMessage',
  document: 'documentMessage',
  sticker: 'stickerMessage',
  location: 'locationMessage',
  contacts: 'contactMessage',
  interactive: 'interactiveMessage',
  button: 'interactiveMessage',
  reaction: 'reactionMessage',
  template: 'templateMessage',
};

export function mapMetaTypeToInternal(metaType: string): string {
  return TYPE_MAP[metaType] || metaType;
}
