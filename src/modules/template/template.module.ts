import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { InstanceModule } from '../instance/instance.module';

@Module({
  imports: [InstanceModule],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
