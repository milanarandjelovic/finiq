import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BudgetQueryBuilder } from '@/modules/budget/builders/budget-query.builder'
import { CategoryQueryBuilder } from '@/modules/category/builders/category-query.builder'
import { DashboardQueryBuilder } from '@/modules/dashboard/builders/dashboard-query.builder'
import { DashboardQueryDto } from '@/modules/dashboard/dtos/dashboard-query.dto'
import { DashboardResponseDto } from '@/modules/dashboard/dtos/dashboard-response.dto'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dashboardQueryBuilder: DashboardQueryBuilder,
    private readonly budgetQueryBuilder: BudgetQueryBuilder,
    private readonly categoryQueryBuilder: CategoryQueryBuilder,
  ) {}

  async getDashboard(
    query: DashboardQueryDto,
    userId: string,
  ): Promise<RestfulResponseDto<DashboardResponseDto>> {
    const { month, year } = query

    const [incomeResult, expenseResult, budgets, spendingRows, categories] =
      await Promise.all([
        this.dashboardQueryBuilder
          .monthlyIncome(userId, month, year)
          .getRawOne<{ total: string }>(),

        this.dashboardQueryBuilder
          .monthlyExpense(userId, month, year)
          .getRawOne<{ total: string }>(),

        this.budgetQueryBuilder.findAll(userId, month, year).getMany(),

        this.dashboardQueryBuilder
          .spendingByCategory(userId, month, year)
          .getRawMany<{ categoryId: string; spent: string }>(),

        this.categoryQueryBuilder.findAllNonGoals(userId).getMany(),
      ])

    const totalIncome = parseFloat(incomeResult.total)
    const totalExpenses = parseFloat(expenseResult.total)
    const balance = totalIncome - totalExpenses
    const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
    const readyToAssign = totalIncome - totalBudgeted

    const spentMap = new Map(
      spendingRows.map((s) => [s.categoryId, parseFloat(s.spent)]),
    )
    const budgetMap = new Map(
      budgets.map((b) => [b.category.id, Number(b.amount)]),
    )

    const categoryBreakdown = categories.map((cat) => {
      const budgeted = budgetMap.get(cat.id) ?? 0
      const spent = spentMap.get(cat.id) ?? 0
      return {
        categoryId: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        color: cat.color,
        budgeted,
        spent,
        available: budgeted - spent,
      }
    })

    return new RestfulResponseDto<DashboardResponseDto>({
      message: 'Successfully returned dashboard.',
      data: {
        dashboard: {
          totalIncome,
          totalExpenses,
          balance,
          readyToAssign,
          categoryBreakdown,
        },
      },
    })
  }
}
