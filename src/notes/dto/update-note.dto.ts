import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Title should not be empty if provided' })
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Text should not be empty if provided' })
  text?: string;
}
