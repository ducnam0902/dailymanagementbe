import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskType, TaskTypeEnum } from 'src/task/types/taskType';
import { RepeatType } from './types/repeatType';

@Entity({ name: 'schedule' })
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: string;

  @Column({ default: '' })
  task: string;

  @Column({ default: '' })
  startedAt: string;

  @Column({
    type: 'enum',
    enum: Object.values(TaskTypeEnum),
  })
  type: TaskType;

  @Column({
    type: 'enum',
    enum: ['Daily', 'Weekly', 'Monthly', 'Off'],
  })
  repeatType: RepeatType;

  @Column({ default: '' })
  repeatEach: string;

  @Column({ default: '' })
  generatedAt: string;

  @Column({ default: '' })
  timezone: string;

  @Column({ default: '' })
  nameJob: string;

  @ManyToOne(() => UserEntity, (user) => user.schedules)
  user: UserEntity;
}
