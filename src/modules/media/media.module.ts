import { Module } from '@nestjs/common';
import { MediaDownloadService } from './media-download.service';
import { MediaController } from './media.controller';
import { InstanceModule } from '../instance/instance.module';
import { BusinessAccountModule } from '../business-account/business-account.module';

@Module({
  imports: [InstanceModule, BusinessAccountModule],
  controllers: [MediaController],
  providers: [MediaDownloadService],
  exports: [MediaDownloadService],
})
export class MediaModule {}
