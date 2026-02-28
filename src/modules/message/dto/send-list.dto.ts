import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseMessageDto } from './message-options.dto';

class ListRowDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class ListSectionDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListRowDto)
  rows: ListRowDto[];
}

export class SendListDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  buttonText: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListSectionDto)
  sections: ListSectionDto[];
}
