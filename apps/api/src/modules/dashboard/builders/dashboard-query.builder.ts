import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { TransactionType } from '@finiq/shared'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

@Injectable()
export class DashboardQueryBuilder {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  monthlyIncome(
    userId: string,
    month: number,
    year: number,
  ): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'total')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.INCOME })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
  }

  monthlyExpense(
    userId: string,
    month: number,
    year: number,
  ): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'total')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.EXPENSE })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
  }

  spendingByCategory(
    userId: string,
    month: number,
    year: number,
  ): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('t')
      .select('t.category_id', 'categoryId')
      .addSelect('COALESCE(SUM(t.amount), 0)', 'spent')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.EXPENSE })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
      .andWhere('t.category_id IS NOT NULL')
      .groupBy('t.category_id')
  }
}
