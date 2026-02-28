import { Module } from '@nestjs/common';
import { WebhookDispatchService } from './webhook-dispatch.service';

@Module({
  providers: [WebhookDispatchService],
  exports: [WebhookDispatchService],
})
export class WebhookDispatchModule {}
