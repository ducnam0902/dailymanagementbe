import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { NoteEntity } from './note.entity';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { UserEntity } from 'src/user/user.entity';
import { CreateRequestContext, EntityManager } from '@mikro-orm/postgresql';
@Injectable()
export class NoteService {
  constructor(
    private readonly em: EntityManager,
  ) {}
  @CreateRequestContext()
  async createNote(
    user: UserEntity,
    createNoteDto: CreateNoteDto,
  ): Promise<NoteEntity> {
    const newNote = new NoteEntity();
    Object.assign(newNote, createNoteDto);
    newNote.user = user;
    console.log('user', user);
    console.log('newNote', newNote);
    await this.em.persistAndFlush(newNote);
    return newNote;
  }

  async getNote(userId: string, date: string): Promise<NoteEntity[]> {
    const response = await this.em.find(NoteEntity, {
        user: {
          id: userId,
        },
        createdAt: date,
    });

    return response;
  }

  async completeNote(userId: string, noteId: string): Promise<NoteEntity> {
    const existedNote: NoteEntity = await this.em.findOne(NoteEntity, {
      user: {
        id: userId,
      },
      id: noteId,
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

    await this.em.persistAndFlush(completedNote);
    return completedNote;
  }
}
