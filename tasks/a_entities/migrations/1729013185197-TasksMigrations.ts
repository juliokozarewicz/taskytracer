import { MigrationInterface, QueryRunner } from "typeorm";

export class TasksMigrations1729013185197 implements MigrationInterface {
    name = 'TasksMigrations1729013185197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "category" character varying(255) NOT NULL, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskName" character varying(255) NOT NULL, "category" character varying(255) NOT NULL, "description" character varying(500), "dueDate" TIMESTAMP NOT NULL DEFAULT now(), "statusName" character varying(255) NOT NULL, CONSTRAINT "PK_0385ca690d1697cdf7ff1ed3c2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task_entity"`);
        await queryRunner.query(`DROP TABLE "category_entity"`);
    }

}
