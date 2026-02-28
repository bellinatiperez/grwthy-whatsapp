import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseMessageDto } from './message-options.dto';

export class ContactItemDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  url?: string;
}

export class SendContactDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactItemDto)
  contact: ContactItemDto[];
}
