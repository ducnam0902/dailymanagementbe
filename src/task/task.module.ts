import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { MailModule } from 'src/mail/mail.module';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, UserEntity]), MailModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
