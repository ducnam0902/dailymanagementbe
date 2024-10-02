import {
  Property,
  Entity,
  ManyToOne,
  Enum,
} from '@mikro-orm/postgresql';

import { UserEntity } from 'src/user/user.entity';
import { BaseEntity } from '@/utils/base.entity';
import { NoteType } from '@/utils';


@Entity({ tableName: 'note' })
export class NoteEntity extends BaseEntity {

  @Property({ default: '' })
  note: string;

  @Property({ default: false })
  isCompleted: boolean;

  @Enum(() => NoteType)
  type: NoteType;

  @ManyToOne()
  user: UserEntity;
}


