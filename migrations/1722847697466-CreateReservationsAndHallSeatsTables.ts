import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReservationsAndHallSeatsTables1722847697466 implements MigrationInterface {
    name = 'CreateReservationsAndHallSeatsTables1722847697466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "seat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "seat_type" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_4e72ae40c3fbd7711ccb380ac17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation_hall_seats" ("id" SERIAL NOT NULL, "reserved" boolean NOT NULL, "reservationId" uuid, "hallSeatId" uuid, "sessionId" uuid, CONSTRAINT "PK_1862d577a33820a7733f6d9f7a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hall_seat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hall_id" uuid, "seat_id" uuid, CONSTRAINT "PK_080b572cb51bfb813caf115967a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."reservation_status_status_enum" NOT NULL, CONSTRAINT "PK_48ea1d97377ae25a5e1c1c8c57c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "total_price" integer NOT NULL, "expires_at" TIMESTAMP NOT NULL, "session_id" uuid, "reservation_status_id" uuid, CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seats" ADD CONSTRAINT "FK_c034f816f4cbaf4ff5caa269144" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seats" ADD CONSTRAINT "FK_ff5a179bb250d7a0b13d88ac0c3" FOREIGN KEY ("hallSeatId") REFERENCES "hall_seat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seats" ADD CONSTRAINT "FK_64b9866453ea2e61151c3b65a9f" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hall_seat" ADD CONSTRAINT "FK_7fe8ef8e8b6964b2151c073f05f" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hall_seat" ADD CONSTRAINT "FK_1b05725fd58eb5ac996d9cca9ac" FOREIGN KEY ("seat_id") REFERENCES "seat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_b069fceb9fa6d2959cd58ba5dfc" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_bd7789f65b27aff923c5987687e" FOREIGN KEY ("reservation_status_id") REFERENCES "reservation_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_bd7789f65b27aff923c5987687e"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_b069fceb9fa6d2959cd58ba5dfc"`);
        await queryRunner.query(`ALTER TABLE "hall_seat" DROP CONSTRAINT "FK_1b05725fd58eb5ac996d9cca9ac"`);
        await queryRunner.query(`ALTER TABLE "hall_seat" DROP CONSTRAINT "FK_7fe8ef8e8b6964b2151c073f05f"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seats" DROP CONSTRAINT "FK_64b9866453ea2e61151c3b65a9f"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seats" DROP CONSTRAINT "FK_ff5a179bb250d7a0b13d88ac0c3"`);
        await queryRunner.query(`ALTER TABLE "reservation_hall_seats" DROP CONSTRAINT "FK_c034f816f4cbaf4ff5caa269144"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TABLE "reservation_status"`);
        await queryRunner.query(`DROP TABLE "hall_seat"`);
        await queryRunner.query(`DROP TABLE "reservation_hall_seats"`);
        await queryRunner.query(`DROP TABLE "seat"`);
    }

}
