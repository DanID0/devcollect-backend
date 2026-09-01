import { IsArray, IsString, MinLength } from 'class-validator';

export class CreateGuideDto {
  @IsString()
  @MinLength(4)
  title!: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsString()
  @MinLength(4)
  text!: string;

  @IsString()
  categoryId!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];
}
