import { buildLocationMessage } from './location-message.builder';

describe('buildLocationMessage', () => {
  it('should build a basic location message', () => {
    const result = buildLocationMessage('5511999999999', -23.5505, -46.6333);

    expect(result).toEqual({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      type: 'location',
      to: '5511999999999',
      location: { latitude: -23.5505, longitude: -46.6333 },
    });
  });

  it('should include name when provided', () => {
    const result = buildLocationMessage('5511999999999', -23.55, -46.63, {
      name: 'Paulista Avenue',
    });

    expect(result.location.name).toBe('Paulista Avenue');
  });

  it('should include address when provided', () => {
    const result = buildLocationMessage('5511999999999', -23.55, -46.63, {
      address: 'São Paulo, SP, Brazil',
    });

    expect(result.location.address).toBe('São Paulo, SP, Brazil');
  });

  it('should include context for quoted messages', () => {
    const result = buildLocationMessage('5511999999999', -23.55, -46.63, {
      quotedMessageId: 'wamid.abc',
    });

    expect(result.context).toEqual({ message_id: 'wamid.abc' });
  });

  it('should not include optional fields when not provided', () => {
    const result = buildLocationMessage('5511999999999', 0, 0);
    expect(result.location.name).toBeUndefined();
    expect(result.location.address).toBeUndefined();
  });
});
