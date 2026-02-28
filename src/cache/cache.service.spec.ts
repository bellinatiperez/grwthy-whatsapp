import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    on: jest.fn(),
    disconnect: jest.fn(),
  }));
});

describe('CacheService', () => {
  let service: CacheService;
  let redisClient: any;

  beforeEach(() => {
    const configService = {
      get: jest.fn((key: string) => {
        const map: Record<string, any> = {
          'redis.url': 'redis://localhost:6379',
          'redis.prefix': 'test:',
          'redis.ttl': 60,
        };
        return map[key];
      }),
    } as unknown as ConfigService;

    service = new CacheService(configService);
    // Access the private client via any cast
    redisClient = (service as any).client;
  });

  describe('get', () => {
    it('should return parsed JSON when value exists', async () => {
      redisClient.get.mockResolvedValue('{"name":"John"}');
      const result = await service.get<{ name: string }>('user:1');
      expect(result).toEqual({ name: 'John' });
      expect(redisClient.get).toHaveBeenCalledWith('test:user:1');
    });

    it('should return null when key does not exist', async () => {
      redisClient.get.mockResolvedValue(null);
      const result = await service.get('missing');
      expect(result).toBeNull();
    });

    it('should return raw value when JSON parse fails', async () => {
      redisClient.get.mockResolvedValue('plain-string');
      const result = await service.get<string>('key');
      expect(result).toBe('plain-string');
    });
  });

  describe('set', () => {
    it('should serialize and store with default TTL', async () => {
      await service.set('key', { data: true });
      expect(redisClient.set).toHaveBeenCalledWith(
        'test:key',
        '{"data":true}',
        'EX',
        60,
      );
    });

    it('should use custom TTL when provided', async () => {
      await service.set('key', 'value', 120);
      expect(redisClient.set).toHaveBeenCalledWith(
        'test:key',
        'value',
        'EX',
        120,
      );
    });

    it('should store strings without JSON serialization', async () => {
      await service.set('key', 'plain');
      expect(redisClient.set).toHaveBeenCalledWith(
        'test:key',
        'plain',
        'EX',
        60,
      );
    });
  });

  describe('del', () => {
    it('should delete the prefixed key', async () => {
      await service.del('key');
      expect(redisClient.del).toHaveBeenCalledWith('test:key');
    });
  });

  describe('reset', () => {
    it('should delete all keys with prefix', async () => {
      redisClient.keys.mockResolvedValue(['test:a', 'test:b']);
      await service.reset();
      expect(redisClient.keys).toHaveBeenCalledWith('test:*');
      expect(redisClient.del).toHaveBeenCalledWith('test:a', 'test:b');
    });

    it('should not call del when no keys found', async () => {
      redisClient.keys.mockResolvedValue([]);
      await service.reset();
      expect(redisClient.del).not.toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect the redis client', () => {
      service.onModuleDestroy();
      expect(redisClient.disconnect).toHaveBeenCalled();
    });
  });
});
