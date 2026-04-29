import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '@/modules/user/entities/user.entity'

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ example: 'Groceries' })
  @Column({ type: 'varchar' })
  name: string

  @ApiProperty({ example: '🛒' })
  @Column({ type: 'varchar' })
  emoji: string

  @ApiProperty({ example: '#FF5733' })
  @Column({ type: 'varchar' })
  color: string

  @ApiProperty({ example: 500.0 })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    name: 'budget_amount',
  })
  budgetAmount: number

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', default: false, name: 'is_goal' })
  isGoal: boolean

  @ApiPropertyOptional({ example: 10000.0 })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'target_amount',
  })
  targetAmount: number | null

  @ApiPropertyOptional({ example: '2026-12-31' })
  @Column({ type: 'date', nullable: true, name: 'target_date' })
  targetDate: Date | null

  @ApiProperty({ example: 0 })
  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ApiProperty({ example: '2025-09-30 20:06:18.871313' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @ApiProperty({ example: '2025-09-30 20:06:18.871313' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date
}
