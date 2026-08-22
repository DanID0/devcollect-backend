import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';
import { CanBeNull } from '../../common/decorators/canBeNull.js';
import { CanBeUndefined } from '../../common/decorators/canBeUndefined.js';
import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(3)
  @IsOptional()
  username?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  profileDescription?: string | null;

  @IsString()
  @IsOptional()
  @CanBeNull()
  @CanBeUndefined()
  avatarUrl?: string | null;
}
