import { TaskEntity } from './../task/task.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ScheduleEntity } from '../schedules/schedule.entity';
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  refreshToken: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];

  @OneToMany(() => ScheduleEntity, (schedules) => schedules.user)
  schedules: ScheduleEntity[];
}
