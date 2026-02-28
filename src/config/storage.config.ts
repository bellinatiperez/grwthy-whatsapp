import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  endpoint: process.env.S3_ENDPOINT || 'localhost',
  port: parseInt(process.env.S3_PORT || '9000', 10),
  useSsl: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
  bucketName: process.env.S3_BUCKET_NAME || 'whatsapp-meta-api',
  region: process.env.S3_REGION || 'us-east-1',
}));
