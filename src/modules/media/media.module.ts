import { Module } from '@nestjs/common';
import { MediaDownloadService } from './media-download.service';
import { InstanceModule } from '../instance/instance.module';

@Module({
  imports: [InstanceModule],
  providers: [MediaDownloadService],
  exports: [MediaDownloadService],
})
export class MediaModule {}
