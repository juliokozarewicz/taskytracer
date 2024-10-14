import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRefreshTokenEntity1632732800002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the refresh_token table
        await queryRunner.createTable(new Table({
            name: 'refresh_token',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()', // Default value for UUID
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP', // Set default to current timestamp
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255', // Email field with max length
                },
                {
                    name: 'token',
                    type: 'varchar',
                    length: '1000', // Token field with max length
                },
                {
                    name: 'user',
                    type: 'uuid', // This is the foreign key column
                    isNullable: false, // This field is required
                },
            ],
        }));

        // Create foreign key to AccountUser
        await queryRunner.createForeignKey('refresh_token', new TableForeignKey({
            columnNames: ['user'], // Column in this table
            referencedColumnNames: ['id'], // Column in the referenced table
            referencedTableName: 'account_user', // Referenced table name
            onDelete: 'CASCADE', // Action on delete
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign keys
        await queryRunner.dropForeignKey('refresh_token', 'FK_AccountUser'); // Adjust the name as needed

        // Drop the refresh_token table
        await queryRunner.dropTable('refresh_token');
    }
}
