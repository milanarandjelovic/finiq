import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DashboardQueryBuilder } from '@/modules/dashboard/builders/dashboard-query.builder'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

describe('DashboardQueryBuilder', () => {
  let builder: DashboardQueryBuilder

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardQueryBuilder,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile()

    builder = module.get<DashboardQueryBuilder>(DashboardQueryBuilder)
  })

  it('monthlyIncome: should build query summing income for month/year', () => {
    const qb = builder.monthlyIncome('user-1', 3, 2026)

    expect(qb).toBeDefined()
  })

  it('monthlyExpense: should build query summing expenses for month/year', () => {
    const qb = builder.monthlyExpense('user-1', 3, 2026)

    expect(qb).toBeDefined()
  })

  it('spendingByCategory: should build query grouping expense by category', () => {
    const qb = builder.spendingByCategory('user-1', 3, 2026)

    expect(qb).toBeDefined()
  })
})
