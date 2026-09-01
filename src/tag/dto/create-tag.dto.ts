import { IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name!: string;
}
