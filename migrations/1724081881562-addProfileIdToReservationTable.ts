import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileIdToReservationTable1724081881562 implements MigrationInterface {
    name = 'AddProfileIdToReservationTable1724081881562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "profile_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "profile_id"`);
    }

}
