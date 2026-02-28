export const SUPPORTED_MESSAGE_TYPES = [
  'text',
  'image',
  'video',
  'audio',
  'document',
  'sticker',
  'location',
  'contacts',
  'interactive',
  'button',
  'reaction',
] as const;

export type SupportedMessageType = (typeof SUPPORTED_MESSAGE_TYPES)[number];
