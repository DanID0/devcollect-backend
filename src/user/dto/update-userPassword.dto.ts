import { IsOptional, IsString, MinLength } from 'class-validator';
export class UpdateUserPasswordDto {
  @IsString()
  @MinLength(7)
  currentPassword!: string;

  @IsString()
  @MinLength(7)
  newPassword!: string;
}
