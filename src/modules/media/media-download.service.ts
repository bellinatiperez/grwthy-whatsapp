import { Injectable, Logger } from '@nestjs/common';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { StorageService } from '../../storage/storage.service';
import { InstanceService } from '../instance/instance.service';

@Injectable()
export class MediaDownloadService {
  private readonly logger = new Logger(MediaDownloadService.name);

  constructor(
    private readonly metaApiClient: MetaApiClient,
    private readonly storageService: StorageService,
    private readonly instanceService: InstanceService,
  ) {}

  async downloadAndStore(instanceName: string, mediaId: string): Promise<{ key: string; url: string }> {
    const instance = await this.instanceService.findByName(instanceName);

    const mediaInfo = await this.metaApiClient.getMediaUrl(mediaId, instance.accessToken);
    const buffer = await this.metaApiClient.downloadMedia(mediaInfo.url, instance.accessToken);

    const key = `${instance.id}/${mediaId}`;
    await this.storageService.uploadFile(key, buffer, mediaInfo.mime_type);

    const url = await this.storageService.getPresignedUrl(key);
    return { key, url };
  }
}
