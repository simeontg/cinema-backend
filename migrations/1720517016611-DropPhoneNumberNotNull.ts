import { MigrationInterface, QueryRunner } from "typeorm";

export class DropPhoneNumberNotNull1720517016611 implements MigrationInterface {
    name = 'DropPhoneNumberNotNull1720517016611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "phoneNumber" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "phoneNumber" SET NOT NULL`);
    }

}
