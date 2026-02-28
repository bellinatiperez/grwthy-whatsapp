import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || '3100', 10),
  apiKey: process.env.APP_API_KEY || '',
  corsOrigin: process.env.APP_CORS_ORIGIN || '*',
  logLevel: process.env.LOG_LEVEL || 'info',
}));
