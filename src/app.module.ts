import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { appConfig, databaseConfig, metaApiConfig, redisConfig, storageConfig } from './config';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { StorageModule } from './storage/storage.module';
import { MetaApiModule } from './shared/meta-api/meta-api.module';
import { BusinessAccountModule } from './modules/business-account/business-account.module';
import { InstanceModule } from './modules/instance/instance.module';
import { MessageModule } from './modules/message/message.module';
import { MetaWebhookModule } from './modules/webhook/meta-webhook.module';
import { WebhookDispatchModule } from './modules/webhook-dispatch/webhook-dispatch.module';
import { TemplateModule } from './modules/template/template.module';
import { BusinessProfileModule } from './modules/business-profile/business-profile.module';
import { ContactModule } from './modules/contact/contact.module';
import { ChatModule } from './modules/chat/chat.module';
import { MediaModule } from './modules/media/media.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, metaApiConfig, redisConfig, storageConfig],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    DatabaseModule,
    CacheModule,
    StorageModule,
    MetaApiModule,
    BusinessAccountModule,
    InstanceModule,
    MessageModule,
    MetaWebhookModule,
    WebhookDispatchModule,
    TemplateModule,
    BusinessProfileModule,
    ContactModule,
    ChatModule,
    MediaModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
