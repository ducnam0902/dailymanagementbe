import { IsNotEmpty } from 'class-validator';

export class CurrentWeekDto {
  @IsNotEmpty({ message: 'Task is not empty' })
  readonly startDate: string;

  @IsNotEmpty({ message: 'Task type is required field' })
  readonly endDate: string;
}
