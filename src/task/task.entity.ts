import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskType } from './types/taskType';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  task: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: '' })
  dateCreated: string;

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

  @Column({
    type: 'enum',
    enum: [
      'Activities',
      'Development',
      'New Routine',
      'Planning',
      'Shopping',
      'Other',
    ],
  })
  type: TaskType;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user: UserEntity;
}
