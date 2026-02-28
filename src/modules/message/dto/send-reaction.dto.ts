import { IsString, IsNotEmpty } from 'class-validator';

export class SendReactionDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  reaction: string;
}
