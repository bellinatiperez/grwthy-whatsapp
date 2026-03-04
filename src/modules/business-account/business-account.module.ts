import { Module } from '@nestjs/common';
import { BusinessAccountController } from './business-account.controller';
import { BusinessAccountService } from './business-account.service';
import { InstanceModule } from '../instance/instance.module';
import { MetaApiModule } from '../../shared/meta-api/meta-api.module';

@Module({
  imports: [InstanceModule, MetaApiModule],
  controllers: [BusinessAccountController],
  providers: [BusinessAccountService],
  exports: [BusinessAccountService],
})
export class BusinessAccountModule {}
