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

  const mockDashboardQueryBuilder: any = {
    monthlyIncome: jest.fn(() => ({
      getRawOne: jest.fn().mockResolvedValue({ total: '5000' }),
    })),
    monthlyExpense: jest.fn(() => ({
      getRawOne: jest.fn().mockResolvedValue({ total: '3000' }),
    })),
    spendingByCategory: jest.fn(() => ({
      getRawMany: jest.fn().mockResolvedValue([
        { categoryId: 'cat-1', spent: '1000' },
        { categoryId: 'cat-2', spent: '2000' },
      ]),
    })),
  }

  const mockBudgetQueryBuilder: any = {
    findAll: jest.fn(() => ({
      getMany: jest
        .fn()
        .mockResolvedValue([{ category: { id: 'cat-1' }, amount: '1500' }]),
    })),
  }

  const mockCategoryQueryBuilder: any = {
    findAllNonGoals: jest.fn(() => ({
      getMany: jest.fn().mockResolvedValue([
        { id: 'cat-1', name: 'Food', emoji: '🍔', color: '#ff0000' },
        { id: 'cat-2', name: 'Transport', emoji: '🚗', color: '#00ff00' },
      ]),
    })),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {},
        },
        {
          provide: DashboardQueryBuilder,
          useValue: mockDashboardQueryBuilder,
        },
        {
          provide: BudgetQueryBuilder,
          useValue: mockBudgetQueryBuilder,
        },
        {
          provide: CategoryQueryBuilder,
          useValue: mockCategoryQueryBuilder,
        },
      ],
    }).compile()

    service = module.get<DashboardService>(DashboardService)
  })

  it('getDashboard: should compute correct totals and breakdown', async () => {
    const result = await service.getDashboard(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.dashboard.totalIncome).toBe(5000)
    expect(result.data.dashboard.totalExpenses).toBe(3000)
    expect(result.data.dashboard.balance).toBe(2000)
    expect(result.data.dashboard.readyToAssign).toBe(3500) // 5000 - 1500
    expect(result.data.dashboard.categoryBreakdown).toHaveLength(2)
  })
})
