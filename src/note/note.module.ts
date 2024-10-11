import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './note.entity';
import { MailModule } from 'src/mail/mail.module';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, UserEntity]), MailModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
