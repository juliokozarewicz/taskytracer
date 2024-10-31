import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountsCreate1728997771753 implements MigrationInterface {
    name = 'AccountsCreate1728997771753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_profile_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "biography" character varying(500), "phone" character varying(25), "cpf" character varying(25), "user" uuid, CONSTRAINT "REL_5817257e026eb77e83da19354c" UNIQUE ("user"), CONSTRAINT "PK_577771af92630f64e2cf4a1b447" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_activate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "code" character varying(515) NOT NULL, "user" uuid, CONSTRAINT "PK_790b1ee73cf527c0249115b4a9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "level" boolean NOT NULL DEFAULT false, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "isEmailConfirmed" boolean NOT NULL DEFAULT false, "password" character varying(255) NOT NULL, "isBanned" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_5eabce4b153e1ced3b922e87397" UNIQUE ("email"), CONSTRAINT "PK_b084442999b27ff6a558471643d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "token" character varying(3500) NOT NULL, "userId" uuid, CONSTRAINT "PK_a78813e06745b2c5d5b9776bfcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_profile_entity" ADD CONSTRAINT "FK_5817257e026eb77e83da19354ce" FOREIGN KEY ("user") REFERENCES "account_user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_activate" ADD CONSTRAINT "FK_442e5d01d28dab80757f516fdca" FOREIGN KEY ("user") REFERENCES "account_user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" ADD CONSTRAINT "FK_ebf65cd067163c7c66baa3da1c1" FOREIGN KEY ("userId") REFERENCES "account_user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" DROP CONSTRAINT "FK_ebf65cd067163c7c66baa3da1c1"`);
        await queryRunner.query(`ALTER TABLE "email_activate" DROP CONSTRAINT "FK_442e5d01d28dab80757f516fdca"`);
        await queryRunner.query(`ALTER TABLE "account_profile_entity" DROP CONSTRAINT "FK_5817257e026eb77e83da19354ce"`);
        await queryRunner.query(`DROP TABLE "refresh_token_entity"`);
        await queryRunner.query(`DROP TABLE "account_user_entity"`);
        await queryRunner.query(`DROP TABLE "email_activate"`);
        await queryRunner.query(`DROP TABLE "account_profile_entity"`);
    }

}
