import { Injectable, Logger } from '@nestjs/common';
import { InstanceService } from '../instance/instance.service';
import { IncomingMessageProcessor } from './processors/incoming-message.processor';
import { MessageStatusProcessor } from './processors/message-status.processor';

@Injectable()
export class MetaWebhookService {
  private readonly logger = new Logger(MetaWebhookService.name);

  constructor(
    private readonly instanceService: InstanceService,
    private readonly incomingProcessor: IncomingMessageProcessor,
    private readonly statusProcessor: MessageStatusProcessor,
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
        const contact = value.contacts?.find((c: any) => c.wa_id === message.from);
        await this.incomingProcessor.process(instance, message, contact);
      }
    }

    if (value.statuses) {
      for (const status of value.statuses) {
        await this.statusProcessor.process(instance, status);
      }
    }
  }
}
