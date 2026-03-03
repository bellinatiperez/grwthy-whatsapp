import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { StorageService } from '../../storage/storage.service';
import { MediaDownloadService } from './media-download.service';
import { InstanceService } from '../instance/instance.service';

@UseGuards(ApiKeyGuard)
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaDownloadService: MediaDownloadService,
    private readonly storageService: StorageService,
    private readonly instanceService: InstanceService,
  ) {}

  @Get(':instanceName/:mediaId')
  async getMedia(
    @Param('instanceName') instanceName: string,
    @Param('mediaId') mediaId: string,
    @Res() res: Response,
  ) {
    const instance = await this.instanceService.findByName(instanceName);
    const key = `${instance.id}/${mediaId}`;

    try {
      const buffer = await this.storageService.downloadFile(key);
      res.set('Cache-Control', 'private, max-age=86400');
      res.send(buffer);
    } catch {
      const { url } = await this.mediaDownloadService.downloadAndStore(instanceName, mediaId);
      res.redirect(url);
    }
  }
}
