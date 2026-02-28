import { Global, Module } from '@nestjs/common';
import { MetaApiClient } from './meta-api.client';

@Global()
@Module({
  providers: [MetaApiClient],
  exports: [MetaApiClient],
})
export class MetaApiModule {}
