import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { TaskType } from '../../task/types/taskType';
import { RepeatType } from '../types/repeatType';

export enum TaskTypeEnum {
  'Activities',
  'Development',
  'New Routine',
  'Planning',
  'Shopping',
  'Other',
}

export enum RepeatTypeEnum {
  'Daily',
  'Monthly',
  'Weekly',
  'Off',
}

export class CreateScheduleDto {
  @IsNotEmpty({ message: 'Task is not empty' })
  @MinLength(3, { message: 'At least 3 characters' })
  readonly task: string;

  @IsNotEmpty({ message: 'Task type is required field' })
  @IsEnum(TaskTypeEnum, { message: 'Task Type is required an enum structure' })
  readonly type: TaskType;

  @IsNotEmpty({ message: 'Started at is required field' })
  readonly startedAt: string;

  @IsNotEmpty({ message: 'Repeat Type is required field' })
  @IsEnum(RepeatTypeEnum, {
    message: 'Repeat type is required an enum structure',
  })
  readonly repeatType: RepeatType;

  readonly repeatEach: string;
}
