import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { InstanceModule } from '../instance/instance.module';
import { BusinessAccountModule } from '../business-account/business-account.module';

@Module({
  imports: [InstanceModule, BusinessAccountModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
