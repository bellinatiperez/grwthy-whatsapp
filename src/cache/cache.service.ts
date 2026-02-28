import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: Redis;
  private readonly prefix: string;
  private readonly defaultTtl: number;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('redis.url')!;
    this.prefix = this.configService.get<string>('redis.prefix') || 'wma:';
    this.defaultTtl = this.configService.get<number>('redis.ttl') || 300;
    this.client = new Redis(url);
    this.client.on('error', (err) => this.logger.error('Redis error', err));
  }

  private key(k: string): string {
    return `${this.prefix}${k}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(this.key(key));
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.set(this.key(key), serialized, 'EX', ttl ?? this.defaultTtl);
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.key(key));
  }

  async reset(): Promise<void> {
    const keys = await this.client.keys(`${this.prefix}*`);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}
