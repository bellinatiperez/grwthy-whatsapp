import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { InstanceService } from './instance.service';
import { CreateInstanceDto } from './dto/create-instance.dto';

@UseGuards(ApiKeyGuard)
@Controller('instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

  private getBusinessAccountRefId(req: express.Request): string | undefined {
    return req.headers['x-business-account-id'] as string | undefined;
  }

  @Post()
  create(@Body() dto: CreateInstanceDto, @Req() req: express.Request) {
    const userId = req.headers['x-user-id'] as string | undefined;
    return this.instanceService.create(dto, userId, this.getBusinessAccountRefId(req));
  }

  @Get()
  findAll(@Req() req: express.Request) {
    const businessAccountRefId = this.getBusinessAccountRefId(req);
    if (businessAccountRefId) {
      return this.instanceService.findByBusinessAccountRefId(businessAccountRefId);
    }
    return this.instanceService.findAll();
  }

  @Get(':instanceName')
  async findByName(@Param('instanceName') name: string, @Req() req: express.Request) {
    const instance = await this.instanceService.findByName(name);
    const businessAccountRefId = this.getBusinessAccountRefId(req);
    if (businessAccountRefId && instance.businessAccountRefId !== businessAccountRefId) {
      throw new NotFoundException(`Instance "${name}" not found`);
    }
    return instance;
  }

  @Delete(':instanceName')
  async remove(@Param('instanceName') name: string, @Req() req: express.Request) {
    const instance = await this.instanceService.findByName(name);
    const businessAccountRefId = this.getBusinessAccountRefId(req);
    if (businessAccountRefId && instance.businessAccountRefId !== businessAccountRefId) {
      throw new NotFoundException(`Instance "${name}" not found`);
    }
    return this.instanceService.remove(name);
  }
}
