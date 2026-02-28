import { IsString, IsNotEmpty } from 'class-validator';
import { BaseMessageDto } from './message-options.dto';

export class SendAudioDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  audio: string;
}
