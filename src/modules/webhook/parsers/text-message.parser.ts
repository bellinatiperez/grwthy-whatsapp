export function parseTextMessage(message: any): any {
  return { conversation: message.text?.body || '' };
}
