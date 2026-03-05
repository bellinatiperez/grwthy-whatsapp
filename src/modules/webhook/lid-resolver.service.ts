import { Injectable, Logger } from '@nestjs/common';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { CacheService } from '../../cache/cache.service';

const LID_CACHE_TTL = 86400; // 24h

@Injectable()
export class LidResolverService {
  private readonly logger = new Logger(LidResolverService.name);

  constructor(
    private readonly metaApiClient: MetaApiClient,
    private readonly cache: CacheService,
  ) {}

  async resolve(
    instance: { phoneNumberId: string; accessToken: string | null },
    from: string,
    contact?: any,
  ): Promise<string> {
    if (contact?.wa_id && contact.wa_id !== from) {
      return contact.wa_id;
    }

    const isLid = !!contact?.user_id;
    if (!isLid) return from;

    const cacheKey = `lid:${from}`;
    const cached = await this.cache.get<string>(cacheKey);
    if (cached) return cached;

    if (instance.accessToken) {
      const resolved = await this.metaApiClient.resolvePhoneNumber(
        instance.phoneNumberId,
        instance.accessToken,
        from,
      );
      if (resolved) {
        await this.cache.set(cacheKey, resolved, LID_CACHE_TTL);
        this.logger.log(`Resolved LID ${from} → ${resolved}`);
        return resolved;
      }
    }

    this.logger.warn(`Could not resolve LID ${from} to phone number`);
    return from;
  }
}
