import { Controller, Get, Post, Query, Body, HttpCode, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MetaWebhookService } from './meta-webhook.service';

@Controller('webhook/meta')
export class MetaWebhookController {
  private readonly logger = new Logger(MetaWebhookController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService: MetaWebhookService,
  ) {}

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const verifyToken = this.configService.get<string>('meta.webhookVerifyToken');

    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook verified');
      return challenge;
    }

    this.logger.warn('Webhook verification failed');
    return 'VERIFICATION_FAILED';
  }

  @Post()
  @HttpCode(200)
  async receive(@Body() body: any): Promise<string> {
    if (body.object !== 'whatsapp_business_account') {
      return 'NOT_WHATSAPP';
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          await this.webhookService.processWebhookPayload(change.value);
        }
      }
    }

    return 'EVENT_RECEIVED';
  }
}
