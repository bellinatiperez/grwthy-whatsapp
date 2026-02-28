import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseMessageDto } from './message-options.dto';

class ButtonReplyDto {
  @IsString()
  id: string;

  @IsString()
  title: string;
}

class ButtonItemDto {
  @ValidateNested()
  @Type(() => ButtonReplyDto)
  reply: ButtonReplyDto;
}

export class SendButtonsDto extends BaseMessageDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ButtonItemDto)
  buttons: ButtonItemDto[];
}
