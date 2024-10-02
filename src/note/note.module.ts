import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { NoteEntity } from './note.entity';

@Module({
  imports: [MikroOrmModule.forFeature([NoteEntity])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
