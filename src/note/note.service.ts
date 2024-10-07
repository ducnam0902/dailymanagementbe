import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { UserEntity } from 'src/user/user.entity';
import { Raw } from 'typeorm';
import { Between } from 'typeorm';
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
    const data = await this.noteRepository.insert(newNote);
    return data.raw[0];
  }

  async getNote(userId: number, date: string): Promise<NoteEntity[]> {
    const response = await this.noteRepository.find({
      where: {
        createdAt: Raw((alias) => `${alias} >= :date`, { date }),
        user: {
          id: userId,
        },
      },
      relations: {
        user: false,
      },
      order: {
        isCompleted: 'ASC',
      },
    });
    return response;
  }

  async completeNote(userId: number, noteId: number): Promise<NoteEntity> {
    const existedNote: NoteEntity = await this.noteRepository.findOne({
      where: {
        id: noteId,
        user: {
          id: userId,
        },
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

    await this.noteRepository.update(existedNote.id, { isCompleted: true });
    return completedNote;
  }

  async getNoteByWeek(
    startDate: string,
    endDate: string,
    userId: number,
  ): Promise<NoteEntity[]> {
    const startedDate = new Date(startDate);
    const endedDate = new Date(endDate);
    const response = await this.noteRepository.find({
      where: {
        createdAt: Between(startedDate.toISOString(), endedDate.toISOString()),
        user: {
          id: userId,
        },
      },
      relations: {
        user: false,
      },
    });
    
    return response;
  }
}
