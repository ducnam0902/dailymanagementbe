
import { hash } from 'bcrypt';
import {
  BeforeCreate,
  Collection,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/postgresql';

import { NoteEntity } from 'src/note/note.entity';
import { BaseEntity } from '@/utils/base.entity';
@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {

  @Property()
  email: string;

  @Property({ default: '', columnType: 'text' })
  image: string;

  @Property()
  password: string;

  @Property({ default: '', columnType: 'text' })
  refreshToken: string;

  @Property({ default: '' })
  firstName: string;

  @Property({ default: '' })
  lastName: string;

  @BeforeCreate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => NoteEntity, (note) => note.user)
  notes = new Collection<UserEntity>(this)
}
