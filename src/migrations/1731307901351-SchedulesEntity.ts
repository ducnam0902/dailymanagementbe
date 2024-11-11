import { MigrationInterface, QueryRunner } from "typeorm";

export class SchedulesEntity1731307901351 implements MigrationInterface {
    name = 'SchedulesEntity1731307901351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."schedule_type_enum" AS ENUM('Activities', 'Development', 'New Routine', 'Planning', 'Shopping', 'Other')`);
        await queryRunner.query(`CREATE TYPE "public"."schedule_repeattype_enum" AS ENUM('Daily', 'Weekly', 'Monthly', 'Off')`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "task" character varying NOT NULL DEFAULT '', "startedAt" character varying NOT NULL DEFAULT '', "type" "public"."schedule_type_enum" NOT NULL, "repeatType" "public"."schedule_repeattype_enum" NOT NULL, "repeatEach" character varying NOT NULL DEFAULT '', "userId" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_d796103491cf0bae197dda59477" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_d796103491cf0bae197dda59477"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_repeattype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_type_enum"`);
    }

}
