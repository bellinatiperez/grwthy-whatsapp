import { registerAs } from '@nestjs/config';

export default registerAs('meta', () => ({
  url: process.env.META_API_URL || 'https://graph.facebook.com',
  version: process.env.META_API_VERSION || 'v25.0',
  webhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || '',
}));
