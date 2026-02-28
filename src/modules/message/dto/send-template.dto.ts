import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { BaseMessageDto } from './message-options.dto';

export class SendTemplateDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsOptional()
  @IsArray()
  components?: any[];
}
