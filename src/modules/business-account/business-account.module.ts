import { Module } from '@nestjs/common';
import { BusinessAccountController } from './business-account.controller';
import { BusinessAccountService } from './business-account.service';
import { InstanceModule } from '../instance/instance.module';

@Module({
  imports: [InstanceModule],
  controllers: [BusinessAccountController],
  providers: [BusinessAccountService],
  exports: [BusinessAccountService],
})
export class BusinessAccountModule {}
