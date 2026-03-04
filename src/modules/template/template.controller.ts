import { Body, Controller, Delete, Get, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountContextInterceptor } from '../../common/interceptors/business-account-context.interceptor';
import { ResolvedBusinessAccount } from '../../common/decorators/resolved-business-account.decorator';
import { TemplateService } from './template.service';
import type { BusinessAccount } from '../../database/schema/schema';
import { CreateTemplateDto, EditTemplateDto, DeleteTemplateDto } from './dto/create-template.dto';

@UseGuards(ApiKeyGuard)
@UseInterceptors(BusinessAccountContextInterceptor)
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  findAll(@ResolvedBusinessAccount() ba: BusinessAccount) {
    return this.templateService.findAll(ba);
  }

  @Post()
  create(@ResolvedBusinessAccount() ba: BusinessAccount, @Body() dto: CreateTemplateDto) {
    return this.templateService.create(ba, dto);
  }

  @Put()
  edit(@ResolvedBusinessAccount() ba: BusinessAccount, @Body() dto: EditTemplateDto) {
    return this.templateService.edit(ba, dto);
  }

  @Delete()
  remove(@ResolvedBusinessAccount() ba: BusinessAccount, @Body() dto: DeleteTemplateDto) {
    return this.templateService.remove(ba, dto);
  }
}
