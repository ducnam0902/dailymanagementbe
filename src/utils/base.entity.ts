import { PrimaryKey, Property, OptionalProps } from '@mikro-orm/postgresql';

export abstract class BaseEntity {
    [OptionalProps]?: 'createdAt' | 'updatedAt';
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()'})
    id: string;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}