import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndNote1728369682607 implements MigrationInterface {
    name = 'CreateUserAndNote1728369682607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."note_type_enum" AS ENUM('Activities', 'Development', 'New Routine', 'Planning', 'Shopping', 'Other')`);
        await queryRunner.query(`CREATE TABLE "note" ("id" SERIAL NOT NULL, "note" character varying NOT NULL DEFAULT '', "isCompleted" boolean NOT NULL DEFAULT false, "dateCreated" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" "public"."note_type_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "refreshToken" character varying NOT NULL DEFAULT '', "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TYPE "public"."note_type_enum"`);
    }

}
