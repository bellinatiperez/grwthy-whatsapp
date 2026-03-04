import { Body, Controller, Delete, Get, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountContextInterceptor } from '../../common/interceptors/business-account-context.interceptor';
import { ResolvedInstance } from '../../common/decorators/resolved-instance.decorator';
import { ResolvedBusinessAccount } from '../../common/decorators/resolved-business-account.decorator';
import { TemplateService } from './template.service';
import type { Instance, BusinessAccount } from '../../database/schema/schema';
import { CreateTemplateDto, EditTemplateDto, DeleteTemplateDto } from './dto/create-template.dto';

@UseGuards(ApiKeyGuard)
@UseInterceptors(BusinessAccountContextInterceptor)
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // --- Business Account based routes (no instance needed) ---

  @Get()
  findAllByBA(@ResolvedBusinessAccount() ba: BusinessAccount) {
    return this.templateService.findAllByBusinessAccount(ba);
  }

  @Post()
  createByBA(@ResolvedBusinessAccount() ba: BusinessAccount, @Body() dto: CreateTemplateDto) {
    return this.templateService.createForBusinessAccount(ba, dto);
  }

  @Put()
  editByBA(@ResolvedBusinessAccount() ba: BusinessAccount, @Body() dto: EditTemplateDto) {
    return this.templateService.editForBusinessAccount(ba, dto);
  }

  @Delete()
  removeByBA(@ResolvedBusinessAccount() ba: BusinessAccount, @Body() dto: DeleteTemplateDto) {
    return this.templateService.removeForBusinessAccount(ba, dto);
  }

  // --- Legacy instance-based routes ---

  @Get(':instanceName')
  findAll(@ResolvedInstance() instance: Instance) {
    return this.templateService.findAll(instance);
  }

  @Post(':instanceName')
  create(@ResolvedInstance() instance: Instance, @Body() dto: CreateTemplateDto) {
    return this.templateService.create(instance, dto);
  }

  @Put(':instanceName')
  edit(@ResolvedInstance() instance: Instance, @Body() dto: EditTemplateDto) {
    return this.templateService.edit(instance, dto);
  }

  @Delete(':instanceName')
  remove(@ResolvedInstance() instance: Instance, @Body() dto: DeleteTemplateDto) {
    return this.templateService.remove(instance, dto);
  }
}
