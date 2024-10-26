import { AuthGuard } from './../user/guards/auth.guards';
import { CustomValidationResponse } from 'src/shared/pipes/CustomValidationResponse.pipe';
import { CreateNoteDto } from './dto/CreateNoteDto';
import { NoteService } from './note.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { NoteEntity } from './note.entity';
import { ResponseCreatedData } from 'src/utils';
import { CurrentWeekDto } from './dto/CurrentWeekDto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationResponse())
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() user: UserEntity,
  ): Promise<ResponseCreatedData> {
    const response = await this.noteService.createNote(user, createNoteDto);
    return {
      ok: !!response?.id,
    };
  }

  @Get(':date')
  @UseGuards(AuthGuard)
  async getAllNoteByDate(
    @User('id') userId: number,
    @Param('date') date: string,
  ): Promise<NoteEntity[]> {
    return await this.noteService.getNote(userId, date);
  }

  @Put(':noteId')
  @UseGuards(AuthGuard)
  async completedNote(
    @User('id') userId: number,
    @Param('noteId') noteId: number,
  ): Promise<NoteEntity> {
    return await this.noteService.completeNote(userId, noteId);
  }

  @Post('/getByWeek')
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationResponse())
  async getNotesByWeek(
    @Body() currentWeek: CurrentWeekDto,
    @User('id') userId: number,
  ): Promise<NoteEntity[]> {
    return await this.noteService.getNoteByWeek(
      currentWeek.startDate,
      currentWeek.endDate,
      userId,
    );
  }

  @Post('/markCompleted')
  @UseGuards(AuthGuard)
  async markCompletedNote(
    @User('id') userId: number,
    @Body() noteIdList: string[],
  ): Promise<ResponseCreatedData> {
    const response = await this.noteService.completeNotes(userId, noteIdList);
    return {
      ok: response.length === noteIdList.length,
    };
  }
}
