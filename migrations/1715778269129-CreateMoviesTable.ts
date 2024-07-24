import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMoviesTable1715778269129 implements MigrationInterface {
    name = 'CreateMoviesTable1715778269129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "duration" integer NOT NULL, "imageUrl" character varying NOT NULL, "genre" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "trended" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movies"`);
    }

}
