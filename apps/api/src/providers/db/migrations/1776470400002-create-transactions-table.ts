import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTransactionsTable1776470400002 implements MigrationInterface {
  name = 'CreateTransactionsTable1776470400002'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "transaction_type_enum" AS ENUM ('income', 'expense')`,
    )
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "transaction_type_enum" NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "date" date NOT NULL,
        "note" character varying,
        "receipt_path" character varying,
        "user_id" uuid NOT NULL,
        "category_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_transactions_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_transactions_category" FOREIGN KEY ("category_id")
          REFERENCES "categories"("id") ON DELETE SET NULL
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_user_id" ON "transactions" ("user_id")`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_date" ON "transactions" ("date")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transactions"`)
    await queryRunner.query(`DROP TYPE "transaction_type_enum"`)
  }
}
