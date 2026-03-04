import { Module } from '@nestjs/common';
import { BusinessProfileController } from './business-profile.controller';
import { BusinessProfileService } from './business-profile.service';
import { InstanceModule } from '../instance/instance.module';
import { BusinessAccountModule } from '../business-account/business-account.module';

@Module({
  imports: [InstanceModule, BusinessAccountModule],
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService],
})
export class BusinessProfileModule {}
