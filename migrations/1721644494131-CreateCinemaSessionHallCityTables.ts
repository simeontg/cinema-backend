import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCinemaSessionHallCityTables1721644494131 implements MigrationInterface {
    name = 'CreateCinemaSessionHallCityTables1721644494131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "halls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hall_name" character varying NOT NULL, "hall_plan" jsonb NOT NULL, "cinemaId" uuid, CONSTRAINT "PK_4665c2f3b1e718e12b06278bae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cinemas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "cityId" uuid, CONSTRAINT "PK_5c49a5f87710ce93fad49d72320" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "movie_id" character varying NOT NULL, "date" date NOT NULL, "time" TIME NOT NULL, "ticket_price" integer NOT NULL, "cinemaId" uuid, "hallId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "halls" ADD CONSTRAINT "FK_5b95ec1a2b0b4f46e7bc906f6c2" FOREIGN KEY ("cinemaId") REFERENCES "cinemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cinemas" ADD CONSTRAINT "FK_db7c566dde76f65976d7214344b" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_1b10bda50b4ba188fb1c8f5cfdf" FOREIGN KEY ("cinemaId") REFERENCES "cinemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_9af3916ca4424685ada4c823a39" FOREIGN KEY ("hallId") REFERENCES "halls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_9af3916ca4424685ada4c823a39"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_1b10bda50b4ba188fb1c8f5cfdf"`);
        await queryRunner.query(`ALTER TABLE "cinemas" DROP CONSTRAINT "FK_db7c566dde76f65976d7214344b"`);
        await queryRunner.query(`ALTER TABLE "halls" DROP CONSTRAINT "FK_5b95ec1a2b0b4f46e7bc906f6c2"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "cinemas"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "halls"`);
    }

}
