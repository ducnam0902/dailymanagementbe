import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoteType } from './types/noteType';

@Entity({ name: 'note' })
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  note: string;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn({ type: 'date' })
  date: string;

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
  type: NoteType;

  @ManyToOne(() => UserEntity, (user) => user.notes)
  user: UserEntity;
}
