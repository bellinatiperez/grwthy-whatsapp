import { Inject, Injectable, Logger } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WebhookDispatchService } from '../../webhook-dispatch/webhook-dispatch.service';
import { MetaEvent } from '../../../common/constants/meta-events.constant';
import type { Instance } from '../../../database/schema/schema';
import { DRIZZLE } from '../../../database/drizzle.provider';
import * as schema from '../../../database/schema/schema';

@Injectable()
export class MessageStatusProcessor {
  private readonly logger = new Logger(MessageStatusProcessor.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly webhookDispatch: WebhookDispatchService,
  ) {}

  async process(instance: Instance, status: any): Promise<void> {
    const statusData = {
      id: status.id,
      status: status.status,
      timestamp: status.timestamp,
      recipientId: status.recipient_id,
      conversationId: status.conversation?.id,
      pricingModel: status.pricing?.pricing_model,
    };

    await this.webhookDispatch.dispatch(instance.id, MetaEvent.MESSAGES_UPDATE, statusData);

    try {
      await this.db
        .update(schema.messages)
        .set({ status: status.status })
        .where(
          sql`${schema.messages.instanceId} = ${instance.id} AND ${schema.messages.key}->>'id' = ${status.id}`,
        );
    } catch (err) {
      this.logger.error(`Failed to update message status: ${err}`);
    }
  }
}
