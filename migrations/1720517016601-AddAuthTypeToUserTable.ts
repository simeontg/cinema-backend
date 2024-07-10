import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthTypeToUserTable1720517016601 implements MigrationInterface {
    name = 'AddAuthTypeToUserTable1720517016601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."users_authtype_enum" AS ENUM('google', 'local')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "authType" "public"."users_authtype_enum" NOT NULL DEFAULT 'google'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authType"`);
        await queryRunner.query(`DROP TYPE "public"."users_authtype_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }

}
