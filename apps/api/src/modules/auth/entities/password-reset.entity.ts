import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from '@/modules/user/entities/user.entity'

@Entity({
  name: 'password_resets',
})
export class PasswordReset extends BaseEntity {
  @ApiProperty({
    example: 'c9cb1462-2f57-414a-aead-39ca4405e010',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    unique: true,
  })
  @ApiProperty({
    example: 'c9cb1462-2f57-414a-aead-39ca4405e010',
  })
  token: string

  @ApiProperty({})
  @ManyToOne(() => User, (user) => user.passwordResets)
  @JoinColumn({
    name: 'user_id',
  })
  user: User

  @ApiProperty({})
  @Column({
    name: 'expires_at',
    type: 'timestamptz',
    default: () => 'DATE(NOW()) + 1',
  })
  expiresAt: Date
}
