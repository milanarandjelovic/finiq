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

import { TransactionType } from '@finiq/shared'
import { Category } from '@/modules/category/entities/category.entity'
import { User } from '@/modules/user/entities/user.entity'

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @ApiProperty({ example: 'c9cb1462-2f57-414a-aead-39ca4405e010' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType

  @ApiProperty({ example: 49.99 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number

  @ApiProperty({ example: '2026-04-18' })
  @Column({ type: 'date' })
  date: Date

  @ApiPropertyOptional({ example: 'Weekly grocery run' })
  @Column({ type: 'varchar', nullable: true })
  note: string | null

  @ApiPropertyOptional({ example: 'receipts/abc123.pdf' })
  @Column({ type: 'varchar', nullable: true, name: 'receipt_path' })
  receiptPath: string | null

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ApiPropertyOptional()
  @ManyToOne(() => Category, { nullable: true, eager: false })
  @JoinColumn({ name: 'category_id' })
  category: Category | null

  @ApiProperty({ example: '2025-09-30 20:06:18.871313' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @ApiProperty({ example: '2025-09-30 20:06:18.871313' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date
}
