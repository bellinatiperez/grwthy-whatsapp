import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { InstanceModule } from '../instance/instance.module';
import { BusinessAccountModule } from '../business-account/business-account.module';

@Module({
  imports: [InstanceModule, BusinessAccountModule],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
