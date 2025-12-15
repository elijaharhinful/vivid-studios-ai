import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGoogleOAuthToUsers1734268800000 implements MigrationInterface {
  name = 'AddGoogleOAuthToUsers1734268800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make password_hash nullable to support OAuth users
    await queryRunner.changeColumn(
      'users',
      'password_hash',
      new TableColumn({
        name: 'password_hash',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );

    // Add oauth_provider column
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'oauth_provider',
        type: 'varchar',
        length: '50',
        isNullable: true,
      })
    );

    // Add oauth_provider_id column
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'oauth_provider_id',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );

    // Create index for faster OAuth user lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_users_oauth_provider_id" 
      ON "users" ("oauth_provider", "oauth_provider_id") 
      WHERE oauth_provider IS NOT NULL AND oauth_provider_id IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index
    await queryRunner.query(`DROP INDEX "IDX_users_oauth_provider_id"`);

    // Remove oauth_provider_id column
    await queryRunner.dropColumn('users', 'oauth_provider_id');

    // Remove oauth_provider column
    await queryRunner.dropColumn('users', 'oauth_provider');

    // Revert password_hash to NOT NULL
    // Note: This will fail if there are OAuth users without passwords
    await queryRunner.changeColumn(
      'users',
      'password_hash',
      new TableColumn({
        name: 'password_hash',
        type: 'varchar',
        length: '255',
        isNullable: false,
      })
    );
  }
}
