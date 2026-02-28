import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { InstanceModule } from '../instance/instance.module';

@Module({
  imports: [InstanceModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
