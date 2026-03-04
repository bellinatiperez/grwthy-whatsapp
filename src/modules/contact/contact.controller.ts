import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountContextInterceptor } from '../../common/interceptors/business-account-context.interceptor';
import { ResolvedInstance } from '../../common/decorators/resolved-instance.decorator';
import { ContactService } from './contact.service';
import type { Instance } from '../../database/schema/schema';

@UseGuards(ApiKeyGuard)
@UseInterceptors(BusinessAccountContextInterceptor)
@Controller('chat')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('contacts/:instanceName')
  findAll(@ResolvedInstance() instance: Instance) {
    return this.contactService.findAll(instance);
  }
}
