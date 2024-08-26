import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToReservationHallSeat1724619807412 implements MigrationInterface {
    name = 'AddNameToReservationHallSeat1724619807412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" RENAME COLUMN "reserved" TO "name"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" ADD "name" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" RENAME COLUMN "name" TO "reserved"`);
    }

}
