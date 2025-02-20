import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchedule1739870791475 implements MigrationInterface {
    name = 'UpdateSchedule1739870791475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" ADD "generatedAt" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "timezone" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "nameJob" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "nameJob"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "generatedAt"`);
    }

}
