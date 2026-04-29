import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreatePasswordResetsTable1759273283217 implements MigrationInterface {
  name = 'CreatePasswordResetsTable1759273283217'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "password_resets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT DATE(NOW()) + 1,
                "user_id" uuid,
                CONSTRAINT "UQ_9b34edd5264effbbc875c266a9e" UNIQUE ("token"),
                CONSTRAINT "PK_4816377aa98211c1de34469e742" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            ALTER TABLE "email_verifications"
            ALTER COLUMN "expires_at"
            SET DEFAULT DATE(NOW()) + 1
        `)
    await queryRunner.query(`
            ALTER TABLE "password_resets"
            ADD CONSTRAINT "FK_f7a4c3bc48f24df007936d217be" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "password_resets" DROP CONSTRAINT "FK_f7a4c3bc48f24df007936d217be"
        `)
    await queryRunner.query(`
            ALTER TABLE "email_verifications"
            ALTER COLUMN "expires_at"
            SET DEFAULT (date(now()) + 1)
        `)
    await queryRunner.query(`
            DROP TABLE "password_resets"
        `)
  }
}
