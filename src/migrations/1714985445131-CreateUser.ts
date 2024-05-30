import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1714985445131 implements MigrationInterface {
    name = 'CreateUser1714985445131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refreshToken" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refreshToken" DROP DEFAULT`);
    }

}
