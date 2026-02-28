import { parseInteractiveMessage } from './interactive-message.parser';

describe('parseInteractiveMessage', () => {
  it('should parse button reply', () => {
    const message = {
      interactive: {
        type: 'button_reply',
        button_reply: { id: 'btn1', title: 'Yes' },
      },
    };

    expect(parseInteractiveMessage(message)).toEqual({
      interactiveMessage: {
        type: 'button_reply',
        buttonReply: { id: 'btn1', title: 'Yes' },
      },
    });
  });

  it('should parse list reply', () => {
    const message = {
      interactive: {
        type: 'list_reply',
        list_reply: { id: 'row1', title: 'Option 1', description: 'Desc' },
      },
    };

    expect(parseInteractiveMessage(message)).toEqual({
      interactiveMessage: {
        type: 'list_reply',
        listReply: { id: 'row1', title: 'Option 1', description: 'Desc' },
      },
    });
  });

  it('should handle missing interactive data', () => {
    const result = parseInteractiveMessage({});
    expect(result.interactiveMessage.type).toBeUndefined();
  });
});
