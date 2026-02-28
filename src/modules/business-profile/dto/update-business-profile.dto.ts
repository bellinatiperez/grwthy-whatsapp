import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateBusinessProfileDto {
  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  vertical?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  websites?: string[];
}
