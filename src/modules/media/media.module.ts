import { Module } from '@nestjs/common';
import { MediaDownloadService } from './media-download.service';
import { MediaController } from './media.controller';
import { InstanceModule } from '../instance/instance.module';

@Module({
  imports: [InstanceModule],
  controllers: [MediaController],
  providers: [MediaDownloadService],
  exports: [MediaDownloadService],
})
export class MediaModule {}
