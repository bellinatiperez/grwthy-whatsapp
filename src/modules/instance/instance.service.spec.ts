import { NotFoundException, ConflictException } from '@nestjs/common';
import { InstanceService } from './instance.service';

describe('InstanceService', () => {
  let service: InstanceService;
  let mockDb: any;
  let mockCache: any;

  const mockInstance = {
    id: 'inst_1',
    name: 'test-instance',
    phoneNumberId: '123456',
    businessAccountId: 'biz_1',
    accessToken: 'token_abc',
    apiKey: 'key_abc',
  };

  beforeEach(() => {
    // Chainable query builder mock
    const createQueryChain = (result: any[] = []) => {
      const chain: any = {};
      chain.select = jest.fn().mockReturnValue(chain);
      chain.from = jest.fn().mockReturnValue(chain);
      chain.where = jest.fn().mockReturnValue(chain);
      chain.limit = jest.fn().mockResolvedValue(result);
      chain.insert = jest.fn().mockReturnValue(chain);
      chain.values = jest.fn().mockReturnValue(chain);
      chain.returning = jest.fn().mockResolvedValue([mockInstance]);
      chain.delete = jest.fn().mockReturnValue(chain);
      return chain;
    };

    mockDb = createQueryChain();

    mockCache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    service = new InstanceService(mockDb, mockCache);
  });

  describe('create', () => {
    it('should create instance and cache it', async () => {
      mockDb.limit.mockResolvedValue([]); // no existing instance

      const result = await service.create({
        instanceName: 'test-instance',
        phoneNumberId: '123456',
        businessAccountId: 'biz_1',
        accessToken: 'token_abc',
      });

      expect(result).toEqual(mockInstance);
      expect(mockCache.set).toHaveBeenCalledWith(
        'instance:name:test-instance',
        mockInstance,
      );
      expect(mockCache.set).toHaveBeenCalledWith(
        'instance:phone:123456',
        mockInstance,
      );
    });

    it('should throw ConflictException if instance already exists', async () => {
      mockDb.limit.mockResolvedValue([mockInstance]);

      await expect(
        service.create({
          instanceName: 'test-instance',
          phoneNumberId: '123456',
          businessAccountId: 'biz_1',
          accessToken: 'token_abc',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByName', () => {
    it('should return cached instance if available', async () => {
      mockCache.get.mockResolvedValue(mockInstance);

      const result = await service.findByName('test-instance');

      expect(result).toEqual(mockInstance);
      expect(mockDb.select).not.toHaveBeenCalled();
    });

    it('should query db and cache when not in cache', async () => {
      mockDb.limit.mockResolvedValue([mockInstance]);

      const result = await service.findByName('test-instance');

      expect(result).toEqual(mockInstance);
      expect(mockCache.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException when instance not found', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(service.findByName('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByPhoneNumberId', () => {
    it('should return cached instance if available', async () => {
      mockCache.get.mockResolvedValue(mockInstance);
      const result = await service.findByPhoneNumberId('123456');
      expect(result).toEqual(mockInstance);
    });

    it('should return null when not found', async () => {
      mockDb.limit.mockResolvedValue([]);
      const result = await service.findByPhoneNumberId('unknown');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all instances from db', async () => {
      mockDb.from.mockResolvedValue([mockInstance]);
      const result = await service.findAll();
      expect(result).toEqual([mockInstance]);
    });
  });

  describe('remove', () => {
    it('should delete instance and clear cache', async () => {
      // findByName chain
      mockDb.limit.mockResolvedValue([mockInstance]);

      const result = await service.remove('test-instance');

      expect(result).toEqual({ deleted: true });
      expect(mockCache.del).toHaveBeenCalledWith('instance:name:test-instance');
      expect(mockCache.del).toHaveBeenCalledWith('instance:phone:123456');
    });
  });
});
