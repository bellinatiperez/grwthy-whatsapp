import { Controller, Get, Param, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountContextInterceptor } from '../../common/interceptors/business-account-context.interceptor';
import { ResolvedInstance } from '../../common/decorators/resolved-instance.decorator';
import { StorageService } from '../../storage/storage.service';
import { MediaDownloadService } from './media-download.service';
import type { Instance } from '../../database/schema/schema';

@UseGuards(ApiKeyGuard)
@UseInterceptors(BusinessAccountContextInterceptor)
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaDownloadService: MediaDownloadService,
    private readonly storageService: StorageService,
  ) {}

  @Get(':instanceName/:mediaId')
  async getMedia(
    @ResolvedInstance() instance: Instance,
    @Param('mediaId') mediaId: string,
    @Res() res: Response,
  ) {
    const key = `${instance.id}/${mediaId}`;

    let buffer: Buffer;
    try {
      buffer = await this.storageService.downloadFile(key);
    } catch {
      const result = await this.mediaDownloadService.downloadAndStore(instance, mediaId);
      buffer = result.buffer;
      res.set('Content-Type', result.mimeType);
    }

    res.set('Cache-Control', 'private, max-age=86400');
    res.send(buffer);
  }
}
