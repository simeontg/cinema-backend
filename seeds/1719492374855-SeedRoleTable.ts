import { MigrationInterface, QueryRunner } from 'typeorm';
import { roles } from './data/roles';
import { Role } from 'apps/auth/src/roles/entities/role.entity';

export class SeedRoleTable1719492374855 implements MigrationInterface {
  name = 'SeedRoleTable1719492374855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (let role of roles) {
      await queryRunner.manager.save(queryRunner.manager.create(Role, role));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM roles`);
  }
}
