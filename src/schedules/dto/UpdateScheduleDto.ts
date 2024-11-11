import { TaskType } from 'src/task/types/taskType';
import { RepeatTypeEnum, TaskTypeEnum } from './CreateScheduleDto';
import { RepeatType } from '../types/repeatType';
import { IsEnum, IsOptional, MinLength } from 'class-validator';

export class UpdateScheduleDto {
  @IsOptional()
  @MinLength(3, { message: 'At least 3 characters' })
  readonly task: string;

  @IsOptional()
  @IsEnum(TaskTypeEnum, { message: 'Task Type is required an enum structure' })
  readonly type: TaskType;

  @IsOptional()
  readonly startedAt: string;

  @IsOptional()
  @IsEnum(RepeatTypeEnum, {
    message: 'Repeat type is required an enum structure',
  })
  readonly repeatType: RepeatType;

  @IsOptional()
  readonly repeatEach: string;
}
