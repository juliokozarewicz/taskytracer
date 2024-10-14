import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAccountProfileEntity1632732800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the account_profile table
        await queryRunner.createTable(new Table({
            name: 'account_profile',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()', // Default value for UUID
                },
                {
                    name: 'biography',
                    type: 'varchar',
                    length: '500',
                    isNullable: true, // Biography can be nullable
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    length: '25',
                    isNullable: true, // Phone can be nullable
                },
                {
                    name: 'cpf',
                    type: 'varchar',
                    length: '25',
                    isNullable: true, // CPF can be nullable
                },
                {
                    name: 'user',
                    type: 'uuid', // This is the foreign key column
                    isNullable: false,
                },
            ],
        }));
        
        /*
        // Create foreign key to AccountUser
        await queryRunner.createForeignKey('account_profile', new TableForeignKey({
            columnNames: ['user'], // Column in this table
            referencedColumnNames: ['id'], // Column in the referenced table
            referencedTableName: 'account_user', // Referenced table name
            onDelete: 'CASCADE', // Action on delete
        }));
        */
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign keys
        await queryRunner.dropForeignKey('account_profile', 'FK_AccountUser');

        // Drop the account_profile table
        await queryRunner.dropTable('account_profile');
    }
}
