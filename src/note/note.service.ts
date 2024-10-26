import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { UserEntity } from 'src/user/user.entity';
import { Raw } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import * as moment from 'moment';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async handleSendNoteUncompleted() {
    const today = moment().format('YYYY-MM-DD');
    const response = await this.noteRepository.find({
      where: {
        dateCreated: today,
      },
      loadRelationIds: true,
      relations: ['user'],
      order: {
        user: {
          id: 'DESC',
        },
        isCompleted: 'ASC',
      },
    });
    const noteByUserList = response.reduce((prevNote, currNote) => {
      const id = currNote.user.toString();
      if (Object.keys(prevNote).includes(id)) {
        return {
          ...prevNote,
          [id]: [...prevNote[id], currNote],
        };
      }
      return {
        ...prevNote,
        [id]: [currNote],
      };
    }, {});

    Object.keys(noteByUserList).forEach(async (item) => {
      const user = await this.userRepository.findOne({
        where: {
          id: Number(item),
        },
      });
      await this.mailService.sendEmailNoteIsNotCompleted(
        noteByUserList[item],
        user,
      );
    });
  }

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
        dateCreated: Raw((alias) => `${alias} = :date`, { date }),
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
    const response = await this.noteRepository.find({
      where: {
        dateCreated: Raw(
          (alias) => `${alias} >= :startDate AND ${alias} <= :endDate`,
          { startDate, endDate },
        ),
        user: {
          id: userId,
        },
      },
      relations: {
        user: false,
      },
      order: {
        dateCreated: 'ASC',
        isCompleted: 'ASC',
      },
    });

    return response;
  }

  async completeNotes(
    userId: number,
    noteIdList: string[],
  ): Promise<NoteEntity[]> {
    const updatedNotes = Promise.all(
      noteIdList.map(async (item) => {
        return await this.completeNote(userId, Number(item));
      }),
    );
    return updatedNotes;
  }
}
