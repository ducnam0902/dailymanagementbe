import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndTasks1730280199919 implements MigrationInterface {
    name = 'CreateUserAndTasks1730280199919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_type_enum" AS ENUM('Activities', 'Development', 'New Routine', 'Planning', 'Shopping', 'Other')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "task" character varying NOT NULL DEFAULT '', "isCompleted" boolean NOT NULL DEFAULT false, "dateCreated" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" "public"."task_type_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "refreshToken" character varying NOT NULL DEFAULT '', "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_type_enum"`);
    }

}
