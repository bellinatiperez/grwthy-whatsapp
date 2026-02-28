import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import axios from 'axios';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class WebhookDispatchService {
  private readonly logger = new Logger(WebhookDispatchService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly cache: CacheService,
  ) {}

  async dispatch(instanceId: string, event: string, data: any): Promise<void> {
    const config = await this.getWebhookConfig(instanceId);
    if (!config || !config.enabled) return;

    if (config.webhookByEvents && config.events) {
      const events = config.events as string[];
      if (!events.includes(event)) return;
    }

    const payload = { event, data, instance: instanceId };

    try {
      await axios.post(config.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers as Record<string, string> || {}),
        },
        timeout: 10000,
      });
    } catch (error) {
      this.logger.error(`Webhook dispatch failed for instance ${instanceId}: ${(error as Error).message}`);
    }
  }

  private async getWebhookConfig(instanceId: string): Promise<schema.WebhookConfig | null> {
    const cached = await this.cache.get<schema.WebhookConfig>(`webhook:config:${instanceId}`);
    if (cached) return cached;

    const [config] = await this.db
      .select()
      .from(schema.webhookConfigs)
      .where(eq(schema.webhookConfigs.instanceId, instanceId))
      .limit(1);

    if (config) {
      await this.cache.set(`webhook:config:${instanceId}`, config);
    }

    return config || null;
  }
}
