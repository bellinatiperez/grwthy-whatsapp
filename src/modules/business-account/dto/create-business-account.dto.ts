import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBusinessAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  businessAccountId: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
