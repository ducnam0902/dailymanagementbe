import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAllSchema1736908130234 implements MigrationInterface {
    name = 'UpdateAllSchema1736908130234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."task_type_enum" RENAME TO "task_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."task_type_enum" AS ENUM('ROUTINE', 'PLAN', 'ACTIVITY', 'DEVELOP', 'SHOPPING', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "type" TYPE "public"."task_type_enum" USING "type"::"text"::"public"."task_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."schedule_type_enum" RENAME TO "schedule_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."schedule_type_enum" AS ENUM('ROUTINE', 'PLAN', 'ACTIVITY', 'DEVELOP', 'SHOPPING', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" TYPE "public"."schedule_type_enum" USING "type"::"text"::"public"."schedule_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."schedule_type_enum_old" AS ENUM('ROUTINE', 'PLAN', 'ACTIVITY', 'DEVELOP', 'SHOPPING', 'OTHER', '0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" TYPE "public"."schedule_type_enum_old" USING "type"::"text"::"public"."schedule_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."schedule_type_enum_old" RENAME TO "schedule_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."task_type_enum_old" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "type" TYPE "public"."task_type_enum_old" USING "type"::"text"::"public"."task_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."task_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."task_type_enum_old" RENAME TO "task_type_enum"`);
    }

}
