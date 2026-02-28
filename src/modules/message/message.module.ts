import { Module } from '@nestjs/common';
import { MessageSendController } from './message-send.controller';
import { MessageSendService } from './message-send.service';
import { MessagePersistenceService } from './message-persistence.service';
import { InstanceModule } from '../instance/instance.module';
import { WebhookDispatchModule } from '../webhook-dispatch/webhook-dispatch.module';

@Module({
  imports: [InstanceModule, WebhookDispatchModule],
  controllers: [MessageSendController],
  providers: [MessageSendService, MessagePersistenceService],
  exports: [MessageSendService, MessagePersistenceService],
})
export class MessageModule {}
