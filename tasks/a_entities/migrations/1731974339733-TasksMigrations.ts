import { MigrationInterface, QueryRunner } from "typeorm";

export class TasksMigrations1731974339733 implements MigrationInterface {
    name = 'TasksMigrations1731974339733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" ADD "userId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" DROP COLUMN "userId"`);
    }

}
