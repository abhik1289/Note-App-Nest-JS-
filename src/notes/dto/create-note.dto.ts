
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Text should not be empty' })
  text: string;
}
