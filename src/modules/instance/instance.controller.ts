import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { InstanceService } from './instance.service';
import { CreateInstanceDto } from './dto/create-instance.dto';

@UseGuards(ApiKeyGuard)
@Controller('instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

  @Post()
  create(@Body() dto: CreateInstanceDto, @Req() req: express.Request) {
    const userId = req.headers['x-user-id'] as string | undefined;
    const businessAccountRefId = req.headers['x-business-account-id'] as string | undefined;
    return this.instanceService.create(dto, userId, businessAccountRefId);
  }

  @Get()
  findAll(@Req() req: express.Request) {
    const businessAccountRefId = req.headers['x-business-account-id'] as string | undefined;
    if (businessAccountRefId) {
      return this.instanceService.findByBusinessAccountRefId(businessAccountRefId);
    }
    return this.instanceService.findAll();
  }

  @Get(':instanceName')
  findByName(@Param('instanceName') name: string) {
    return this.instanceService.findByName(name);
  }

  @Delete(':instanceName')
  remove(@Param('instanceName') name: string) {
    return this.instanceService.remove(name);
  }
}
