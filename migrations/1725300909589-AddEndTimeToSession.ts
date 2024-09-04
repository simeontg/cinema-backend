import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEndTimeToSession1725300909589 implements MigrationInterface {
    name = 'AddEndTimeToSession1725300909589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "time" TO "startTime"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "endTime" TIME NOT NULL DEFAULT '00:00:00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "startTime" TO "time"`);
    }

}
