import { Injectable, Logger } from '@nestjs/common';
import { WebhookDispatchService } from '../../webhook-dispatch/webhook-dispatch.service';
import { MetaEvent } from '../../../common/constants/meta-events.constant';
import { Instance } from '../../../database/schema/schema';

@Injectable()
export class TemplateStatusProcessor {
  private readonly logger = new Logger(TemplateStatusProcessor.name);

  constructor(private readonly webhookDispatch: WebhookDispatchService) {}

  async process(instance: Instance, templateStatus: any): Promise<void> {
    await this.webhookDispatch.dispatch(instance.id, MetaEvent.TEMPLATE_STATUS_UPDATE, templateStatus);
  }
}
