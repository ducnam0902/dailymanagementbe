import { IsEnum, IsMilitaryTime, IsNotEmpty, MinLength } from 'class-validator';
import { TaskType, TaskTypeEnum } from 'src/task/types/taskType';
import { RepeatType } from '../types/repeatType';
import { TimeZoneEnum } from 'src/utils/time';
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

  @IsEnum(TimeZoneEnum, {
    message: 'Timezone is not correct',
  })
  readonly timezone: string;

  @IsMilitaryTime({
    message: 'Generated Field must be in HH:MM format',
  })
  readonly generatedAt: string;
}
