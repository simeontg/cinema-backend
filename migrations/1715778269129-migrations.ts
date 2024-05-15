import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1715778269129 implements MigrationInterface {
    name = 'Migrations1715778269129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "duration" integer NOT NULL, "imageUrl" character varying NOT NULL, "genre" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "trending" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movie"`);
    }

}
