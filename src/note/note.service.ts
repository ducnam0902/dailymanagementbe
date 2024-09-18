import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
  ) {}

  async createNote(
    user: UserEntity,
    createNoteDto: CreateNoteDto,
  ): Promise<NoteEntity> {
    const newNote = new NoteEntity();
    Object.assign(newNote, createNoteDto);
    newNote.user = user;
    const data = await this.noteRepository.save(newNote);
    return data;
  }

  async getNote(userId: number, date: string): Promise<NoteEntity[]> {
    const response = await this.noteRepository.find({
      relations: {
        user: false,
      },
      where: {
        user: {
          id: userId,
        },
        date: date,
      },
    });
    return response;
  }

  async completeNote(userId: number, noteId: number): Promise<NoteEntity> {
    const existedNote: NoteEntity = await this.noteRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: noteId,
      },
    });
    if (!existedNote) {
      throw new UnprocessableEntityException({
        message: 'Note is exists',
      });
    }

    const completedNote: NoteEntity = {
      ...existedNote,
      isCompleted: true,
    };

    const response = await this.noteRepository.save(completedNote);
    return response;
  }
}
