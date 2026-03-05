import { Injectable, Logger } from '@nestjs/common';
import { InstanceService } from '../instance/instance.service';
import { IncomingMessageProcessor } from './processors/incoming-message.processor';
import { MessageStatusProcessor } from './processors/message-status.processor';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { CacheService } from '../../cache/cache.service';

const LID_CACHE_TTL = 86400; // 24h

@Injectable()
export class MetaWebhookService {
  private readonly logger = new Logger(MetaWebhookService.name);

  constructor(
    private readonly instanceService: InstanceService,
    private readonly incomingProcessor: IncomingMessageProcessor,
    private readonly statusProcessor: MessageStatusProcessor,
    private readonly metaApiClient: MetaApiClient,
    private readonly cache: CacheService,
  ) {}

  async processWebhookPayload(value: any): Promise<void> {
    const phoneNumberId = value.metadata?.phone_number_id;
    if (!phoneNumberId) return;

    const instance = await this.instanceService.findByPhoneNumberId(phoneNumberId);
    if (!instance) {
      this.logger.warn(`No instance found for phone_number_id: ${phoneNumberId}`);
      return;
    }

    if (value.messages) {
      for (const message of value.messages) {
        const contact = value.contacts?.find(
          (c: any) => c.wa_id === message.from || c.user_id === message.from,
        );

        const fromNumber = await this.resolveFromNumber(
          instance,
          message.from,
          contact,
        );

        await this.incomingProcessor.process(instance, message, contact, fromNumber);
      }
    }

    if (value.statuses) {
      for (const status of value.statuses) {
        await this.statusProcessor.process(instance, status);
      }
    }
  }

  private async resolveFromNumber(
    instance: { phoneNumberId: string; accessToken: string | null },
    from: string,
    contact?: any,
  ): Promise<string> {
    // If contact has wa_id different from message.from, wa_id is the real phone number
    if (contact?.wa_id && contact.wa_id !== from) {
      return contact.wa_id;
    }

    // Detect LID: if contact has user_id field, we're in LID mode
    const isLid = !!contact?.user_id;
    if (!isLid) return from;

    // Check cache
    const cacheKey = `lid:${from}`;
    const cached = await this.cache.get<string>(cacheKey);
    if (cached) return cached;

    // Resolve via Meta API
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
