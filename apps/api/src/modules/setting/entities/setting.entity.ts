import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '@/modules/user/entities/user.entity'

@Entity({ name: 'settings' })
@Unique(['user', 'key'])
export class Setting extends BaseEntity {
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ example: 'currency' })
  @Column({ type: 'varchar' })
  key: string

  @ApiProperty({ example: 'USD' })
  @Column({ type: 'varchar' })
  value: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ApiProperty({ example: '2025-09-30 20:06:18.871313' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date
}
