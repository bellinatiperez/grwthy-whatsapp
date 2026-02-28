import { Module } from '@nestjs/common';
import { BusinessProfileController } from './business-profile.controller';
import { BusinessProfileService } from './business-profile.service';
import { InstanceModule } from '../instance/instance.module';

@Module({
  imports: [InstanceModule],
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService],
})
export class BusinessProfileModule {}
