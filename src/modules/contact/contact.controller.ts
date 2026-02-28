import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ContactService } from './contact.service';

@UseGuards(ApiKeyGuard)
@Controller('chat')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('contacts/:instanceName')
  findAll(@Param('instanceName') instanceName: string) {
    return this.contactService.findAll(instanceName);
  }
}
