import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Repository } from 'typeorm'

import { TransactionType } from '@finiq/shared'
import { StatisticsQueryBuilder } from '@/modules/statistics/builders/statistics-query.builder'
import { StatisticsQueryDto } from '@/modules/statistics/dtos/statistics-query.dto'
import { StatisticsResponseDto } from '@/modules/statistics/dtos/statistics-response.dto'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly statisticsQueryBuilder: StatisticsQueryBuilder,
  ) {}

  async getStatistics(
    query: StatisticsQueryDto,
    request: Request,
  ): Promise<RestfulResponseDto<StatisticsResponseDto>> {
    const { month, year } = query
    const userId = request.user.id

    // Build last six-month range
    const months: { month: number; year: number }[] = []
    let m = month
    let y = year
    for (let i = 0; i < 6; i++) {
      months.unshift({ month: m, year: y })
      m--

      if (m === 0) {
        m = 12
        y--
      }
    }
    const { month: fromMonth, year: fromYear } = months[0]

    const [spendingRows, trendRows] = await Promise.all([
      this.statisticsQueryBuilder
        .spendingByCategory(userId, month, year)
        .getRawMany<{
          categoryId: string
          name: string
          emoji: string
          color: string
          amount: string
        }>(),

      this.statisticsQueryBuilder
        .monthlyTrend(userId, fromMonth, fromYear, month, year)
        .getRawMany<{
          month: number
          year: number
          type: TransactionType
          total: string
        }>(),
    ])

    const totalSpent = spendingRows.reduce(
      (sum, r) => sum + parseFloat(r.amount),
      0,
    )

    const spendingByCategory = spendingRows.map((r) => ({
      categoryId: r.categoryId,
      name: r.name,
      emoji: r.emoji,
      color: r.color,
      amount: parseFloat(r.amount),
      percentage:
        totalSpent > 0
          ? Math.round((parseFloat(r.amount) / totalSpent) * 10000) / 100
          : 0,
    }))

    const monthlyTrend = months.map(({ month: m, year: y }) => {
      const income = trendRows.find(
        (r) =>
          r.month === m && r.year === y && r.type === TransactionType.INCOME,
      )
      const expense = trendRows.find(
        (r) =>
          r.month === m && r.year === y && r.type === TransactionType.EXPENSE,
      )
      return {
        month: m,
        year: y,
        income: income ? parseFloat(income.total) : 0,
        expenses: expense ? parseFloat(expense.total) : 0,
      }
    })

    return new RestfulResponseDto<StatisticsResponseDto>({
      message: 'Successfully returned statistics.',
      data: { statistics: { spendingByCategory, monthlyTrend } },
    })
  }
}
