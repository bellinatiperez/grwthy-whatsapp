import { IsOptional, IsString } from 'class-validator';

export class QuotedMessageDto {
  @IsString()
  id: string;
}

export class BaseMessageDto {
  @IsOptional()
  quoted?: QuotedMessageDto;

  @IsOptional()
  @IsString()
  webhookUrl?: string;
}
