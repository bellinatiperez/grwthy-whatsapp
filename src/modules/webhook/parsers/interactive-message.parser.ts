export function parseInteractiveMessage(message: any): any {
  const interactive = message.interactive || {};
  return {
    interactiveMessage: {
      type: interactive.type,
      ...(interactive.button_reply && { buttonReply: interactive.button_reply }),
      ...(interactive.list_reply && { listReply: interactive.list_reply }),
    },
  };
}
