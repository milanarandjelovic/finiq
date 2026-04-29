import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { TransactionType } from '@finiq/shared'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

@Injectable()
export class StatisticsQueryBuilder {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  spendingByCategory(
    userId: string,
    month: number,
    year: number,
  ): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('t')
      .innerJoin('t.category', 'cat')
      .select('cat.id', 'categoryId')
      .addSelect('cat.name', 'name')
      .addSelect('cat.emoji', 'emoji')
      .addSelect('cat.color', 'color')
      .addSelect('COALESCE(SUM(t.amount), 0)', 'amount')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.EXPENSE })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
      .groupBy('cat.id')
      .addGroupBy('cat.name')
      .addGroupBy('cat.emoji')
      .addGroupBy('cat.color')
      .orderBy('amount', 'DESC')
  }

  monthlyTrend(
    userId: string,
    fromMonth: number,
    fromYear: number,
    toMonth: number,
    toYear: number,
  ): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('t')
      .select('EXTRACT(MONTH FROM t.date)::int', 'month')
      .addSelect('EXTRACT(YEAR FROM t.date)::int', 'year')
      .addSelect('t.type', 'type')
      .addSelect('COALESCE(SUM(t.amount), 0)', 'total')
      .where('t.user_id = :userId', { userId })
      .andWhere(
        '(EXTRACT(YEAR FROM t.date) * 100 + EXTRACT(MONTH FROM t.date)) >= :from',
        { from: fromYear * 100 + fromMonth },
      )
      .andWhere(
        '(EXTRACT(YEAR FROM t.date) * 100 + EXTRACT(MONTH FROM t.date)) <= :to',
        { to: toYear * 100 + toMonth },
      )
      .groupBy('EXTRACT(MONTH FROM t.date)')
      .addGroupBy('EXTRACT(YEAR FROM t.date)')
      .addGroupBy('t.type')
  }
}
