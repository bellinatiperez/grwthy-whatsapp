import { MessageStatusProcessor } from './message-status.processor';

describe('MessageStatusProcessor', () => {
  let processor: MessageStatusProcessor;
  let mockWebhookDispatch: any;

  const mockInstance = {
    id: 'inst_1',
    name: 'test',
  };

  beforeEach(() => {
    mockWebhookDispatch = {
      dispatch: jest.fn().mockResolvedValue(undefined),
    };
    processor = new MessageStatusProcessor(mockWebhookDispatch);
  });

  it('should extract status data and dispatch webhook', async () => {
    const status = {
      id: 'wamid.abc',
      status: 'delivered',
      timestamp: '1700000000',
      recipient_id: '5511999999999',
      conversation: { id: 'conv_1' },
      pricing: { pricing_model: 'CBP' },
    };

    await processor.process(mockInstance as any, status);

    expect(mockWebhookDispatch.dispatch).toHaveBeenCalledWith(
      'inst_1',
      'messages.update',
      {
        id: 'wamid.abc',
        status: 'delivered',
        timestamp: '1700000000',
        recipientId: '5511999999999',
        conversationId: 'conv_1',
        pricingModel: 'CBP',
      },
    );
  });

  it('should handle status without conversation or pricing', async () => {
    const status = {
      id: 'wamid.xyz',
      status: 'sent',
      timestamp: '1700000001',
      recipient_id: '5511888888888',
    };

    await processor.process(mockInstance as any, status);

    expect(mockWebhookDispatch.dispatch).toHaveBeenCalledWith(
      'inst_1',
      'messages.update',
      {
        id: 'wamid.xyz',
        status: 'sent',
        timestamp: '1700000001',
        recipientId: '5511888888888',
        conversationId: undefined,
        pricingModel: undefined,
      },
    );
  });
});
