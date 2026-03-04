import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { BusinessAccountService } from './business-account.service';
import { InstanceService } from '../instance/instance.service';
import { CreateBusinessAccountDto } from './dto/create-business-account.dto';
import { AddMemberDto } from './dto/add-member.dto';

@UseGuards(ApiKeyGuard)
@Controller('business-account')
export class BusinessAccountController {
  constructor(
    private readonly businessAccountService: BusinessAccountService,
    private readonly instanceService: InstanceService,
  ) {}

  @Post()
  create(@Body() dto: CreateBusinessAccountDto, @Req() req: express.Request) {
    const userId = req.headers['x-user-id'] as string;
    return this.businessAccountService.create(dto, userId);
  }

  @Get()
  findForUser(@Req() req: express.Request) {
    const userId = req.headers['x-user-id'] as string;
    return this.businessAccountService.findForUser(userId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.businessAccountService.findById(id);
  }

  @Get(':id/numbers')
  findNumbers(@Param('id') id: string) {
    return this.instanceService.findByBusinessAccountRefId(id);
  }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.businessAccountService.addMember(id, dto.userId, dto.role);
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.businessAccountService.removeMember(id, userId);
  }
}
