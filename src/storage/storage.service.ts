import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('storage.endpoint')!;
    const port = this.configService.get<number>('storage.port')!;
    const useSsl = this.configService.get<boolean>('storage.useSsl')!;
    const protocol = useSsl ? 'https' : 'http';

    this.bucketName = this.configService.get<string>('storage.bucketName')!;

    this.s3Client = new S3Client({
      endpoint: `${protocol}://${endpoint}:${port}`,
      region: this.configService.get<string>('storage.region')!,
      credentials: {
        accessKeyId: this.configService.get<string>('storage.accessKey')!,
        secretAccessKey: this.configService.get<string>('storage.secretKey')!,
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
    } catch {
      try {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
        this.logger.log(`Bucket "${this.bucketName}" created`);
      } catch (err) {
        this.logger.error(`Failed to create bucket "${this.bucketName}"`, err);
      }
    }
  }

  async uploadFile(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async downloadFile(key: string): Promise<Buffer> {
    const { Body } = await this.s3Client.send(
      new GetObjectCommand({ Bucket: this.bucketName, Key: key }),
    );
    return Buffer.from(await Body!.transformToByteArray());
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
    );
  }
}
