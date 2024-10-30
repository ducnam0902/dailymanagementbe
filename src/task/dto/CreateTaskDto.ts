import { IsNotEmpty } from 'class-validator';
import { TaskType } from '../types/taskType';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Task is not empty' })
  readonly task: string;

  @IsNotEmpty({ message: 'Task type is required field' })
  readonly type: TaskType;

  @IsNotEmpty({ message: 'Date created is required field' })
  readonly dateCreated: string;
}
