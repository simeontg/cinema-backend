import { Movie } from "apps/movies/src/entities/movie.entity";
import { MigrationInterface, QueryRunner } from "typeorm";
import { movies } from './seeds/movies';

export class Seed1715679679952 implements MigrationInterface {
    name = 'Seed1715679679952'

    public async up(queryRunner: QueryRunner): Promise<void> {

        for (let movie of movies) {
            await queryRunner.manager.save(
                queryRunner.manager.create(Movie, {
                    ...movie,
                    "createdAt": new Date(),
                    "updatedAt": new Date()
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE * FROM movie`)
    }

}
