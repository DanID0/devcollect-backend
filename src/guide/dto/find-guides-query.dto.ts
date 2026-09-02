import { IsString } from 'class-validator';

export class findGuidesQueryDto {
  @IsString()
  categoryId?: string;

  @IsString()
  tagId?: string;
}
