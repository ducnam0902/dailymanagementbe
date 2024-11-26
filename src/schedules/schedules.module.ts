import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ScheduleEntity } from './schedule.entity';
import { TaskModule } from '../task/task.module';
import { TaskEntity } from '../task/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleEntity, UserEntity, TaskEntity]),
    TaskModule,
  ],
  providers: [SchedulesService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
