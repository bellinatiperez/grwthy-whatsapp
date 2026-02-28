import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { TemplateService } from './template.service';
import { CreateTemplateDto, EditTemplateDto, DeleteTemplateDto } from './dto/create-template.dto';

@UseGuards(ApiKeyGuard)
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get(':instanceName')
  findAll(@Param('instanceName') instanceName: string) {
    return this.templateService.findAll(instanceName);
  }

  @Post(':instanceName')
  create(@Param('instanceName') instanceName: string, @Body() dto: CreateTemplateDto) {
    return this.templateService.create(instanceName, dto);
  }

  @Put(':instanceName')
  edit(@Param('instanceName') instanceName: string, @Body() dto: EditTemplateDto) {
    return this.templateService.edit(instanceName, dto);
  }

  @Delete(':instanceName')
  remove(@Param('instanceName') instanceName: string, @Body() dto: DeleteTemplateDto) {
    return this.templateService.remove(instanceName, dto);
  }
}
