import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessProfileService } from './business-profile.service';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';

@UseGuards(ApiKeyGuard)
@Controller('business-profile')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Put(':instanceName')
  update(@Param('instanceName') instanceName: string, @Body() dto: UpdateBusinessProfileDto) {
    return this.businessProfileService.update(instanceName, dto);
  }
}
