import { Injectable, Logger } from '@nestjs/common';
import { WebhookDispatchService } from '../../webhook-dispatch/webhook-dispatch.service';
import { MetaEvent } from '../../../common/constants/meta-events.constant';
import { MESSAGE_STATUS } from '../../../common/constants/meta-events.constant';
import { Instance } from '../../../database/schema/schema';

@Injectable()
export class MessageStatusProcessor {
  private readonly logger = new Logger(MessageStatusProcessor.name);

  constructor(private readonly webhookDispatch: WebhookDispatchService) {}

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
  }
}
