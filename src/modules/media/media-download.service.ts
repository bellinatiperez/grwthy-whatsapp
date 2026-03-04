import { Injectable, Logger } from '@nestjs/common';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { StorageService } from '../../storage/storage.service';
import * as schema from '../../database/schema/schema';

@Injectable()
export class MediaDownloadService {
  private readonly logger = new Logger(MediaDownloadService.name);

  constructor(
    private readonly metaApiClient: MetaApiClient,
    private readonly storageService: StorageService,
  ) {}

  async downloadAndStore(
    instance: schema.Instance,
    mediaId: string,
  ): Promise<{ key: string; buffer: Buffer; mimeType: string }> {
    const mediaInfo = await this.metaApiClient.getMediaUrl(mediaId, instance.accessToken!);
    const buffer = await this.metaApiClient.downloadMedia(mediaInfo.url, instance.accessToken!);

    const key = `${instance.id}/${mediaId}`;
    await this.storageService.uploadFile(key, buffer, mediaInfo.mime_type);

    return { key, buffer, mimeType: mediaInfo.mime_type };
  }
}
