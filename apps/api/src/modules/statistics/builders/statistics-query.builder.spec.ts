import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { StatisticsQueryBuilder } from '@/modules/statistics/builders/statistics-query.builder'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

describe('StatisticsQueryBuilder', () => {
  let builder: StatisticsQueryBuilder

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsQueryBuilder,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              addGroupBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile()

    builder = module.get<StatisticsQueryBuilder>(StatisticsQueryBuilder)
  })

  it('spendingByCategory: should build query with category join', () => {
    const qb = builder.spendingByCategory('user-1', 3, 2026)

    expect(qb).toBeDefined()
  })

  it('monthlyTrend: should build query with date range', () => {
    const qb = builder.monthlyTrend('user-1', 10, 2025, 3, 2026)

    expect(qb).toBeDefined()
  })
})
