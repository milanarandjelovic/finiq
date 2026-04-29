import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCategoriesTable1776470400001 implements MigrationInterface {
  name = 'CreateCategoriesTable1776470400001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "emoji" character varying NOT NULL,
        "color" character varying NOT NULL,
        "budget_amount" numeric(12,2) NOT NULL DEFAULT '0',
        "is_goal" boolean NOT NULL DEFAULT false,
        "target_amount" numeric(12,2),
        "target_date" date,
        "sort_order" integer NOT NULL DEFAULT 0,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_categories_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_categories_user_id" ON "categories" ("user_id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categories"`)
  }
}
