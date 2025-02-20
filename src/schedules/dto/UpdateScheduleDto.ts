import { TaskType, TaskTypeEnum } from 'src/task/types/taskType';
import { RepeatTypeEnum } from './CreateScheduleDto';
import { RepeatType } from '../types/repeatType';
import { IsEnum, IsMilitaryTime, IsOptional, MinLength } from 'class-validator';
import { TimeZoneEnum } from 'src/utils/time';
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

  @IsEnum(TimeZoneEnum, {
    message: 'Timezone is not correct',
  })
  readonly timezone: string;

  @IsMilitaryTime({
    message: 'Generated Field must be in HH:MM format',
  })
  readonly generatedAt: string;
}
