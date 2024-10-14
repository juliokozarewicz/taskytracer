import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAccountUserEntity1632732800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the account_user table
        await queryRunner.createTable(new Table({
            name: 'account_user',
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
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP', // Set default to current timestamp
                },
                {
                    name: 'isActive',
                    type: 'boolean',
                    default: true, // Default is true
                },
                {
                    name: 'level',
                    type: 'boolean',
                    default: false, // Default is false
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255', // Name field with max length
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255', // Email field with max length
                    isUnique: true, // Ensure email is unique
                },
                {
                    name: 'isEmailConfirmed',
                    type: 'boolean',
                    default: false, // Default is false
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255', // Password field with max length
                },
                {
                    name: 'isBanned',
                    type: 'boolean',
                    default: true, // Default is true
                },
            ],
        }));

        /*
        // Create foreign key to AccountProfile if the table exists
        await queryRunner.createForeignKey('account_user', new TableForeignKey({
            columnNames: ['profileId'], // Reference column in this table
            referencedColumnNames: ['id'], // Column in the referenced table
            referencedTableName: 'account_profile', // Referenced table name
            onDelete: 'CASCADE', // Action on delete
        }));
        */

        // Additional foreign keys for EmailActivate and RefreshTokenEntity can be added here
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign keys (if they were created)
        // await queryRunner.dropForeignKey('account_user', 'foreign_key_name');

        // Drop the account_user table
        await queryRunner.dropTable('account_user');
    }
}
