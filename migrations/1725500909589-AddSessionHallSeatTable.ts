import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionHallSeatTable1725300912345 implements MigrationInterface {
    name = 'CreateSessionHallSeatTable1725300912345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session_hall_seat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),"createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),"session_id" uuid NOT NULL,"hall_seat_id" uuid NOT NULL,"price" integer NOT NULL,CONSTRAINT "PK_session_hall_seat" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_hall_seat" ADD CONSTRAINT "FK_session_session_hall_seat" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "session_hall_seat" ADD CONSTRAINT "FK_hall_seat_session_hall_seat" FOREIGN KEY ("hall_seat_id") REFERENCES "hall_seat"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "seat" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "ticket_price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_hall_seat" DROP CONSTRAINT "FK_hall_seat_session_hall_seat"`);
        await queryRunner.query(`ALTER TABLE "session_hall_seat" DROP CONSTRAINT "FK_session_session_hall_seat"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "ticket_price" integer`);
        await queryRunner.query(`ALTER TABLE "seat" ADD "price" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "session_hall_seat"`);
    }
}
