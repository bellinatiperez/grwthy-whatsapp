import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBusinessAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  businessAccountId: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
