import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ScheduleEntity } from './schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity, UserEntity])],
  providers: [SchedulesService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
