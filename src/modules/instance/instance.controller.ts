import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { InstanceService } from './instance.service';
import { CreateInstanceDto } from './dto/create-instance.dto';

@UseGuards(ApiKeyGuard)
@Controller('instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

  @Post()
  create(@Body() dto: CreateInstanceDto) {
    return this.instanceService.create(dto);
  }

  @Get()
  findAll() {
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
