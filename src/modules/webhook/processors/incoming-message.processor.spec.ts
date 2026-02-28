import { IncomingMessageProcessor } from './incoming-message.processor';

describe('IncomingMessageProcessor', () => {
  let processor: IncomingMessageProcessor;
  let mockPersistence: any;
  let mockWebhookDispatch: any;

  const mockInstance = {
    id: 'inst_1',
    name: 'test',
    phoneNumberId: '123456',
  };

  const mockSavedMessage = { id: 'msg_1', status: 'RECEIVED' };

  beforeEach(() => {
    mockPersistence = {
      saveIncomingMessage: jest.fn().mockResolvedValue(mockSavedMessage),
    };
    mockWebhookDispatch = {
      dispatch: jest.fn().mockResolvedValue(undefined),
    };
    processor = new IncomingMessageProcessor(
      mockPersistence,
      mockWebhookDispatch,
    );
  });

  it('should parse text message, persist and dispatch webhook', async () => {
    const message = {
      id: 'wamid.abc',
      from: '5511999999999',
      type: 'text',
      timestamp: '1700000000',
      text: { body: 'Hello' },
    };
    const contact = { profile: { name: 'John' } };

    await processor.process(mockInstance as any, message, contact);

    expect(mockPersistence.saveIncomingMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        metaMessageId: 'wamid.abc',
        fromNumber: '5511999999999',
        pushName: 'John',
        messageType: 'conversation',
        messageTimestamp: 1700000000,
        instanceId: 'inst_1',
        fromMe: false,
      }),
    );
    expect(mockWebhookDispatch.dispatch).toHaveBeenCalledWith(
      'inst_1',
      'messages.upsert',
      mockSavedMessage,
    );
  });

  it('should parse image message', async () => {
    const message = {
      id: 'wamid.img',
      from: '5511999999999',
      type: 'image',
      timestamp: '1700000000',
      image: { id: 'media_1', mime_type: 'image/jpeg' },
    };

    await processor.process(mockInstance as any, message);

    expect(mockPersistence.saveIncomingMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        messageType: 'imageMessage',
        message: expect.objectContaining({ mediaId: 'media_1' }),
      }),
    );
  });

  it('should parse location message', async () => {
    const message = {
      id: 'wamid.loc',
      from: '5511999999999',
      type: 'location',
      timestamp: '1700000000',
      location: { latitude: -23.55, longitude: -46.63 },
    };

    await processor.process(mockInstance as any, message);

    expect(mockPersistence.saveIncomingMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        messageType: 'locationMessage',
      }),
    );
  });

  it('should parse reaction message', async () => {
    const message = {
      id: 'wamid.react',
      from: '5511999999999',
      type: 'reaction',
      timestamp: '1700000000',
      reaction: { message_id: 'wamid.original', emoji: '👍' },
    };

    await processor.process(mockInstance as any, message);

    expect(mockPersistence.saveIncomingMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        messageType: 'reactionMessage',
      }),
    );
  });

  it('should skip unsupported message types without throwing', async () => {
    const message = {
      id: 'wamid.unknown',
      from: '5511999999999',
      type: 'unsupported_type',
      timestamp: '1700000000',
    };

    await processor.process(mockInstance as any, message);

    expect(mockPersistence.saveIncomingMessage).not.toHaveBeenCalled();
    expect(mockWebhookDispatch.dispatch).not.toHaveBeenCalled();
  });

  it('should handle missing contact gracefully', async () => {
    const message = {
      id: 'wamid.abc',
      from: '5511999999999',
      type: 'text',
      timestamp: '1700000000',
      text: { body: 'Hi' },
    };

    await processor.process(mockInstance as any, message);

    expect(mockPersistence.saveIncomingMessage).toHaveBeenCalledWith(
      expect.objectContaining({ pushName: undefined }),
    );
  });
});
