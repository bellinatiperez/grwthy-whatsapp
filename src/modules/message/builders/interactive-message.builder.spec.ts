import {
  buildButtonMessage,
  buildListMessage,
} from './interactive-message.builder';

describe('buildButtonMessage', () => {
  const buttons = [
    { type: 'reply', reply: { id: 'btn1', title: 'Yes' } },
    { type: 'reply', reply: { id: 'btn2', title: 'No' } },
  ];

  it('should build a button interactive message', () => {
    const result = buildButtonMessage('5511999999999', 'Choose one', buttons);

    expect(result).toEqual({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      type: 'interactive',
      to: '5511999999999',
      interactive: {
        type: 'button',
        body: { text: 'Choose one' },
        action: { buttons },
      },
    });
  });

  it('should include context for quoted messages', () => {
    const result = buildButtonMessage('5511999999999', 'Choose', buttons, {
      quotedMessageId: 'wamid.abc',
    });

    expect(result.context).toEqual({ message_id: 'wamid.abc' });
  });
});

describe('buildListMessage', () => {
  const sections = [
    {
      title: 'Section 1',
      rows: [
        { id: 'row1', title: 'Option 1', description: 'Desc 1' },
        { id: 'row2', title: 'Option 2' },
      ],
    },
  ];

  it('should build a list interactive message', () => {
    const result = buildListMessage(
      '5511999999999',
      'Menu',
      'Select an option',
      'View',
      sections,
    );

    expect(result.interactive).toEqual({
      type: 'list',
      header: { type: 'text', text: 'Menu' },
      body: { text: 'Select an option' },
      action: { button: 'View', sections },
    });
  });

  it('should include footer when provided', () => {
    const result = buildListMessage(
      '5511999999999',
      'Menu',
      'Select',
      'View',
      sections,
      { footerText: 'Powered by WMA' },
    );

    expect(result.interactive.footer).toEqual({ text: 'Powered by WMA' });
  });

  it('should not include footer when not provided', () => {
    const result = buildListMessage(
      '5511999999999',
      'Menu',
      'Select',
      'View',
      sections,
    );

    expect(result.interactive.footer).toBeUndefined();
  });

  it('should include context for quoted messages', () => {
    const result = buildListMessage(
      '5511999999999',
      'Menu',
      'Select',
      'View',
      sections,
      { quotedMessageId: 'wamid.abc' },
    );

    expect(result.context).toEqual({ message_id: 'wamid.abc' });
  });
});
