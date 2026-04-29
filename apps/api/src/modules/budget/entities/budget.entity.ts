import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { Category } from '@/modules/category/entities/category.entity'
import { User } from '@/modules/user/entities/user.entity'

@Entity({ name: 'budgets' })
@Unique(['user', 'category', 'year', 'month'])
export class Budget extends BaseEntity {
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ example: 2026 })
  @Column({ type: 'int' })
  year: number

  @ApiProperty({ example: 4 })
  @Column({ type: 'int' })
  month: number

  @ApiProperty({ example: 500.0 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ApiProperty()
  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ApiProperty({ example: '2025-09-30 20:06:18.871313' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @ApiProperty({ example: '2025-09-30 20:06:18.871313' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date
}
