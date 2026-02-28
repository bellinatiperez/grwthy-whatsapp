import { Injectable } from '@nestjs/common';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { InstanceService } from '../instance/instance.service';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';

@Injectable()
export class BusinessProfileService {
  constructor(
    private readonly metaApiClient: MetaApiClient,
    private readonly instanceService: InstanceService,
  ) {}

  async update(instanceName: string, dto: UpdateBusinessProfileDto) {
    const instance = await this.instanceService.findByName(instanceName);
    return this.metaApiClient.updateBusinessProfile(instance.phoneNumberId, instance.accessToken, {
      messaging_product: 'whatsapp',
      ...dto,
    });
  }
}
