import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToReservationHallSeat1724619807412 implements MigrationInterface {
    name = 'AddNameToReservationHallSeat1724619807412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" DROP COLUMN "reserved"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" ADD "location" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seat" ADD "reserved" boolean NOT NULL`);
    }

}
