import { Migration } from '@mikro-orm/migrations';

export class Migration20241002045846_createUserAndNote extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "image" text not null default '', "password" varchar(255) not null, "refresh_token" text not null default '', "first_name" varchar(255) not null default '', "last_name" varchar(255) not null default '', constraint "users_pkey" primary key ("id"));`);

    this.addSql(`create table "note" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "note" varchar(255) not null default '', "is_completed" boolean not null default false, "type" text check ("type" in ('ACTIVITIES', 'DEVELOPMENT', 'NEWROUTINE', 'PLANNING', 'SHOPPING', 'OTHER')) not null, "user_id" uuid not null, constraint "note_pkey" primary key ("id"));`);

    this.addSql(`alter table "note" add constraint "note_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`drop table if exists "mikro_orm_migrations" cascade;`);

    this.addSql(`drop table if exists "user_entity" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "note" drop constraint "note_user_id_foreign";`);

    this.addSql(`create table "mikro_orm_migrations" ("id" serial primary key, "name" varchar(255) null, "executed_at" timestamptz(6) null default CURRENT_TIMESTAMP);`);

    this.addSql(`create table "user_entity" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "email" varchar(255) not null, "image" text not null default '', "password" varchar(255) not null, "refresh_token" text not null, "first_name" varchar(255) not null default '', "last_name" varchar(255) not null default '', constraint "user_entity_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "note" cascade;`);
  }

}
