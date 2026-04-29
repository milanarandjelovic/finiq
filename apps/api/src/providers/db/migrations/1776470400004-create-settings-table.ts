import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSettingsTable1776470400004 implements MigrationInterface {
  name = 'CreateSettingsTable1776470400004'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying NOT NULL,
        "value" character varying NOT NULL,
        "user_id" uuid NOT NULL,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_settings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_settings_user_key" UNIQUE ("user_id", "key"),
        CONSTRAINT "FK_settings_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_settings_user_id" ON "settings" ("user_id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "settings"`)
  }
}
