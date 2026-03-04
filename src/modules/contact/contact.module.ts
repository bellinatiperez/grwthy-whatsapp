import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { InstanceModule } from '../instance/instance.module';
import { BusinessAccountModule } from '../business-account/business-account.module';

@Module({
  imports: [InstanceModule, BusinessAccountModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
