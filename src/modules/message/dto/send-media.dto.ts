import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseMessageDto } from './message-options.dto';

export class SendMediaDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  mediatype: 'image' | 'document' | 'video';

  @IsString()
  @IsNotEmpty()
  media: string;

  @IsOptional()
  @IsString()
  mimetype?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}
