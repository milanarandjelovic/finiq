import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEmailVerificationsTable1759270507659 implements MigrationInterface {
  name = 'CreateEmailVerificationsTable1759270507659'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "email_verifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT DATE(NOW()) + 1,
                "user_id" uuid,
                CONSTRAINT "UQ_595be4c36e66b21d3fd14c73a24" UNIQUE ("token"),
                CONSTRAINT "PK_c1ea2921e767f83cd44c0af203f" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            ALTER TABLE "email_verifications"
            ADD CONSTRAINT "FK_c4f1838323ae1dff5aa00148915" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "email_verifications" DROP CONSTRAINT "FK_c4f1838323ae1dff5aa00148915"
        `)
    await queryRunner.query(`
            DROP TABLE "email_verifications"
        `)
  }
}
