import { ApiProperty } from '@nestjs/swagger'
import { hash } from 'bcrypt'
import { Exclude } from 'class-transformer'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { EmailVerification } from '@/modules/auth/entities/email-verification.entity'
import { PasswordReset } from '@/modules/auth/entities/password-reset.entity'

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @ApiProperty({
    example: 'c9cb1462-2f57-414a-aead-39ca4405e010',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    example: 'John Doe',
  })
  @Column({
    type: 'varchar',
    unique: false,
  })
  name: string

  @ApiProperty({
    example: 'john.doe@email.com',
  })
  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string

  @Exclude({
    toPlainOnly: true,
  })
  @Column({
    type: 'varchar',
    select: false,
  })
  password: string

  @ApiProperty({
    example: '2025-09-30 20:06:18.871313',
  })
  @Column({
    type: 'timestamp',
    name: 'activated_at',
    nullable: true,
  })
  activatedAt: Date

  @ApiProperty({
    example: '2025-09-30 20:06:18.871313',
  })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date

  @ApiProperty({
    example: '2025-09-30 20:06:18.871313',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date

  @OneToMany(
    () => EmailVerification,
    (emailVerification) => emailVerification.user,
  )
  emailVerifications: EmailVerification[]

  @OneToMany(() => PasswordReset, (passwordReset) => passwordReset.user)
  passwordResets: PasswordReset[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 12)
    }
  }
}
