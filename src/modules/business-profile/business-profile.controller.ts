import { Body, Controller, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountContextInterceptor } from '../../common/interceptors/business-account-context.interceptor';
import { ResolvedInstance } from '../../common/decorators/resolved-instance.decorator';
import { BusinessProfileService } from './business-profile.service';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { Instance } from '../../database/schema/schema';

@UseGuards(ApiKeyGuard)
@UseInterceptors(BusinessAccountContextInterceptor)
@Controller('business-profile')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Put(':instanceName')
  update(@ResolvedInstance() instance: Instance, @Body() dto: UpdateBusinessProfileDto) {
    return this.businessProfileService.update(instance, dto);
  }
}
