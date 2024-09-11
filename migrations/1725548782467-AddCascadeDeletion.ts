import { MigrationInterface, QueryRunner } from "typeorm";

export class Cascade1725548782467 implements MigrationInterface {
    name = 'Cascade1725548782467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_f056a463749c7b7b6700511bed7" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_b069fceb9fa6d2959cd58ba5dfc" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hall_seat" DROP CONSTRAINT "FK_7fe8ef8e8b6964b2151c073f05f"`);
        await queryRunner.query(`ALTER TABLE "hall_seat" ADD CONSTRAINT "FK_7fe8ef8e8b6964b2151c073f05f" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "halls" ALTER COLUMN "hall_plan" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_f056a463749c7b7b6700511bed7"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_b069fceb9fa6d2959cd58ba5dfc"`);
        await queryRunner.query(`ALTER TABLE "hall_seat" DROP CONSTRAINT "FK_7fe8ef8e8b6964b2151c073f05f"`);
        await queryRunner.query(`ALTER TABLE "hall_seat" ADD CONSTRAINT "FK_7fe8ef8e8b6964b2151c073f05f" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "halls" ALTER COLUMN "hall_plan" SET NOT NULL`);
        
    }

}
