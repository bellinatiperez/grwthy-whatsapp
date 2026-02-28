import { MessagePersistenceService } from './message-persistence.service';

describe('MessagePersistenceService', () => {
  let service: MessagePersistenceService;
  let mockDb: any;

  const mockSavedMessage = {
    id: 'msg_1',
    key: { fromMe: true, id: 'wamid.abc', remoteJid: '5511999999999@s.whatsapp.net' },
    messageType: 'conversation',
    status: 'PENDING',
  };

  beforeEach(() => {
    mockDb = {
      insert: jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockSavedMessage]),
        }),
      }),
    };

    service = new MessagePersistenceService(mockDb);
  });

  describe('saveOutgoingMessage', () => {
    it('should save an outgoing message with PENDING status', async () => {
      const result = await service.saveOutgoingMessage({
        metaMessageId: 'wamid.abc',
        recipientNumber: '5511999999999',
        message: { conversation: 'Hello' },
        messageType: 'conversation',
        instanceId: 'inst_1',
      });

      expect(result).toEqual(mockSavedMessage);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should include webhookUrl when provided', async () => {
      await service.saveOutgoingMessage({
        metaMessageId: 'wamid.abc',
        recipientNumber: '5511999999999',
        message: {},
        messageType: 'conversation',
        instanceId: 'inst_1',
        webhookUrl: 'https://hook.example.com',
      });

      const insertValues = mockDb.insert().values;
      expect(insertValues).toHaveBeenCalled();
    });
  });

  describe('saveIncomingMessage', () => {
    it('should save an incoming message with RECEIVED status', async () => {
      const result = await service.saveIncomingMessage({
        metaMessageId: 'wamid.xyz',
        fromNumber: '5511888888888',
        pushName: 'John',
        message: { conversation: 'Hi' },
        messageType: 'conversation',
        messageTimestamp: 1700000000,
        instanceId: 'inst_1',
        fromMe: false,
      });

      expect(result).toEqual(mockSavedMessage);
    });
  });

  describe('saveStatusUpdate', () => {
    it('should save a message status update', async () => {
      const mockStatus = { id: 'status_1', status: 'READ' };
      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockStatus]),
        }),
      });

      const result = await service.saveStatusUpdate({
        keyId: 'wamid.abc',
        remoteJid: '5511999999999@s.whatsapp.net',
        fromMe: true,
        status: 'READ',
        messageId: 'msg_1',
        instanceId: 'inst_1',
      });

      expect(result).toEqual(mockStatus);
    });
  });
});
