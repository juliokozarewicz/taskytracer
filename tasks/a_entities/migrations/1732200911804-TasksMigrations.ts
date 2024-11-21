import { MigrationInterface, QueryRunner } from "typeorm";

export class TasksMigrations1732200911804 implements MigrationInterface {
    name = 'TasksMigrations1732200911804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "task_entity" ADD "userId" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "task_entity" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD "userId" character varying NOT NULL`);
    }

}
