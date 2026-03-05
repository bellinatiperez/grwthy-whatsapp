import { Module } from '@nestjs/common';
import { MetaWebhookController } from './meta-webhook.controller';
import { MetaWebhookService } from './meta-webhook.service';
import { IncomingMessageProcessor } from './processors/incoming-message.processor';
import { MessageStatusProcessor } from './processors/message-status.processor';
import { TemplateStatusProcessor } from './processors/template-status.processor';
import { InstanceModule } from '../instance/instance.module';
import { MessageModule } from '../message/message.module';
import { WebhookDispatchModule } from '../webhook-dispatch/webhook-dispatch.module';

@Module({
  imports: [InstanceModule, MessageModule, WebhookDispatchModule],
  controllers: [MetaWebhookController],
  providers: [MetaWebhookService, IncomingMessageProcessor, MessageStatusProcessor, TemplateStatusProcessor],
})
export class MetaWebhookModule {}
