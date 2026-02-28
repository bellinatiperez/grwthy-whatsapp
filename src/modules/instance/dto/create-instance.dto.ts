import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WebhookConfigDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  headers?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  events?: string[];

  @IsOptional()
  @IsBoolean()
  webhookByEvents?: boolean;

  @IsOptional()
  @IsBoolean()
  webhookBase64?: boolean;
}

export class CreateInstanceDto {
  @IsString()
  @IsNotEmpty()
  instanceName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumberId: string;

  @IsString()
  @IsNotEmpty()
  businessAccountId: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WebhookConfigDto)
  webhook?: WebhookConfigDto;
}
