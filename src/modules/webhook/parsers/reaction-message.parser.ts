export function parseReactionMessage(message: any): any {
  const reaction = message.reaction || {};
  return {
    reactionMessage: {
      key: { id: reaction.message_id },
      text: reaction.emoji,
    },
  };
}
