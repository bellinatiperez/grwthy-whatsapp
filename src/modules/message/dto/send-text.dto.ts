import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { BaseMessageDto } from './message-options.dto';

export class SendTextDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsBoolean()
  linkPreview?: boolean;
}
