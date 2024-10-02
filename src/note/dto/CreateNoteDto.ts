import { IsNotEmpty } from 'class-validator';
import { NoteType } from '@/utils';

export class CreateNoteDto {
  @IsNotEmpty({ message: 'Note is not empty' })
  readonly note: string;

  @IsNotEmpty({ message: 'Note type is required field' })
  readonly type: NoteType;
}
