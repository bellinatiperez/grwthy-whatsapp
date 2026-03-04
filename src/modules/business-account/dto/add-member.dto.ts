import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class AddMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  @IsIn(['owner', 'admin', 'member'])
  role?: 'owner' | 'admin' | 'member';
}
