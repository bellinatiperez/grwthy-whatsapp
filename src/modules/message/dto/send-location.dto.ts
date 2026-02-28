import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { BaseMessageDto } from './message-options.dto';

export class SendLocationDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
