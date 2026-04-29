import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBudgetsTable1776470400003 implements MigrationInterface {
  name = 'CreateBudgetsTable1776470400003'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "budgets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "year" integer NOT NULL,
        "month" integer NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "user_id" uuid NOT NULL,
        "category_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_budgets" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_budgets_user_category_year_month" UNIQUE ("user_id", "category_id", "year", "month"),
        CONSTRAINT "FK_budgets_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_budgets_category" FOREIGN KEY ("category_id")
          REFERENCES "categories"("id") ON DELETE CASCADE
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_budgets_user_year_month" ON "budgets" ("user_id", "year", "month")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "budgets"`)
  }
}
