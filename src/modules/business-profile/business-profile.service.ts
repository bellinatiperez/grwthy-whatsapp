import { Injectable } from '@nestjs/common';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import * as schema from '../../database/schema/schema';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';

@Injectable()
export class BusinessProfileService {
  constructor(
    private readonly metaApiClient: MetaApiClient,
  ) {}

  async update(instance: schema.Instance, dto: UpdateBusinessProfileDto) {
    return this.metaApiClient.updateBusinessProfile(instance.phoneNumberId, instance.accessToken!, {
      messaging_product: 'whatsapp',
      ...dto,
    });
  }
}
