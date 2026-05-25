import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BudgetQueryBuilder } from '@/modules/budget/builders/budget-query.builder'
import { CategoryQueryBuilder } from '@/modules/category/builders/category-query.builder'
import { DashboardQueryBuilder } from '@/modules/dashboard/builders/dashboard-query.builder'
import { DashboardService } from '@/modules/dashboard/services/dashboard.service'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

describe('DashboardService', () => {
  let service: DashboardService

  function buildModule(overrides: {
    income?: string
    expense?: string
    budgets?: any[]
    spending?: any[]
    categories?: any[]
  }) {
    const {
      income = '5000',
      expense = '3000',
      budgets = [{ category: { id: 'cat-1' }, amount: '1500' }],
      spending = [
        { categoryId: 'cat-1', spent: '1000' },
        { categoryId: 'cat-2', spent: '2000' },
      ],
      categories = [
        { id: 'cat-1', name: 'Food', emoji: '🍔', color: '#ff0000' },
        { id: 'cat-2', name: 'Transport', emoji: '🚗', color: '#00ff00' },
      ],
    } = overrides

    const mockDashboardQueryBuilder = {
      monthlyIncome: jest.fn(() => ({
        getRawOne: jest.fn().mockResolvedValue({ total: income }),
      })),
      monthlyExpense: jest.fn(() => ({
        getRawOne: jest.fn().mockResolvedValue({ total: expense }),
      })),
      spendingByCategory: jest.fn(() => ({
        getRawMany: jest.fn().mockResolvedValue(spending),
      })),
    }

    const mockBudgetQueryBuilder = {
      findAll: jest.fn(() => ({
        getMany: jest.fn().mockResolvedValue(budgets),
      })),
    }

    const mockCategoryQueryBuilder = {
      findAllNonGoals: jest.fn(() => ({
        getMany: jest.fn().mockResolvedValue(categories),
      })),
    }

    return Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Transaction), useValue: {} },
        { provide: DashboardQueryBuilder, useValue: mockDashboardQueryBuilder },
        { provide: BudgetQueryBuilder, useValue: mockBudgetQueryBuilder },
        { provide: CategoryQueryBuilder, useValue: mockCategoryQueryBuilder },
      ],
    }).compile()
  }

  it('getDashboard: should compute correct totals and breakdown', async () => {
    const module = await buildModule({})
    service = module.get<DashboardService>(DashboardService)
    const result = await service.getDashboard(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.dashboard.totalIncome).toBe(5000)
    expect(result.data.dashboard.totalExpenses).toBe(3000)
    expect(result.data.dashboard.balance).toBe(2000)
    expect(result.data.dashboard.readyToAssign).toBe(3500)
    expect(result.data.dashboard.categoryBreakdown).toHaveLength(2)
  })

  it('getDashboard: category with no budget should use 0', async () => {
    const module = await buildModule({
      budgets: [],
      spending: [{ categoryId: 'cat-1', spent: '500' }],
      categories: [{ id: 'cat-1', name: 'Food', emoji: '🍔', color: '#red' }],
    })
    service = module.get<DashboardService>(DashboardService)
    const result = await service.getDashboard(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.dashboard.categoryBreakdown[0].budgeted).toBe(0)
  })

  it('getDashboard: category with no spending should use 0', async () => {
    const module = await buildModule({
      budgets: [{ category: { id: 'cat-1' }, amount: '1000' }],
      spending: [],
      categories: [{ id: 'cat-1', name: 'Food', emoji: '🍔', color: '#red' }],
    })
    service = module.get<DashboardService>(DashboardService)
    const result = await service.getDashboard(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.dashboard.categoryBreakdown[0].spent).toBe(0)
  })
})
