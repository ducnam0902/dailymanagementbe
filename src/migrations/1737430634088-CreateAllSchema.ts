import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllSchema1737430634088 implements MigrationInterface {
    name = 'CreateAllSchema1737430634088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_type_enum" AS ENUM('ROUTINE', 'PLAN', 'ACTIVITY', 'DEVELOP', 'SHOPPING', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "task" character varying NOT NULL DEFAULT '', "isCompleted" boolean NOT NULL DEFAULT false, "dateCreated" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" "public"."task_type_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."schedule_type_enum" AS ENUM('ROUTINE', 'PLAN', 'ACTIVITY', 'DEVELOP', 'SHOPPING', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."schedule_repeattype_enum" AS ENUM('Daily', 'Weekly', 'Monthly', 'Off')`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "task" character varying NOT NULL DEFAULT '', "startedAt" character varying NOT NULL DEFAULT '', "type" "public"."schedule_type_enum" NOT NULL, "repeatType" "public"."schedule_repeattype_enum" NOT NULL, "repeatEach" character varying NOT NULL DEFAULT '', "userId" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "refreshToken" character varying NOT NULL DEFAULT '', "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_d796103491cf0bae197dda59477" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_d796103491cf0bae197dda59477"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_repeattype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_type_enum"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_type_enum"`);
    }

}
