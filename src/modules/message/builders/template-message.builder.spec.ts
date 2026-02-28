import { buildTemplateMessage } from './template-message.builder';

describe('buildTemplateMessage', () => {
  it('should build a basic template message', () => {
    const result = buildTemplateMessage('5511999999999', 'hello_world', 'en_US');

    expect(result).toEqual({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      type: 'template',
      to: '5511999999999',
      template: {
        name: 'hello_world',
        language: { code: 'en_US' },
      },
    });
  });

  it('should include components when provided', () => {
    const components = [
      { type: 'body', parameters: [{ type: 'text', text: 'John' }] },
    ];

    const result = buildTemplateMessage(
      '5511999999999',
      'welcome',
      'pt_BR',
      components,
    );

    expect(result.template.components).toEqual(components);
  });

  it('should not include components when not provided', () => {
    const result = buildTemplateMessage('5511999999999', 'hello', 'en');
    expect(result.template.components).toBeUndefined();
  });

  it('should include context for quoted messages', () => {
    const result = buildTemplateMessage('5511999999999', 'hello', 'en', undefined, {
      quotedMessageId: 'wamid.abc',
    });

    expect(result.context).toEqual({ message_id: 'wamid.abc' });
  });
});
