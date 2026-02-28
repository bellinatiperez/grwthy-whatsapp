import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsBoolean()
  allowCategoryChange?: boolean;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsArray()
  components: any[];
}

export class EditTemplateDto {
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsArray()
  components: any[];
}

export class DeleteTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  hsmId?: string;
}
