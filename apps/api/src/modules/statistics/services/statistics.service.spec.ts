import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { StatisticsQueryBuilder } from '@/modules/statistics/builders/statistics-query.builder'
import { StatisticsService } from '@/modules/statistics/services/statistics.service'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

describe('StatisticsService', () => {
  let service: StatisticsService

  const mockQueryBuilder: any = {
    spendingByCategory: jest.fn(() => ({
      getRawMany: jest.fn().mockResolvedValue([
        {
          categoryId: 'cat-1',
          name: 'Food',
          emoji: '🍔',
          color: '#ff0000',
          amount: '800',
        },
        {
          categoryId: 'cat-2',
          name: 'Transport',
          emoji: '🚗',
          color: '#00ff00',
          amount: '200',
        },
      ]),
    })),
    monthlyTrend: jest.fn(() => ({
      getRawMany: jest.fn().mockResolvedValue([
        { month: 1, year: 2026, type: 'INCOME', total: '5000' },
        { month: 1, year: 2026, type: 'EXPENSE', total: '3000' },
        { month: 2, year: 2026, type: 'INCOME', total: '4500' },
        { month: 2, year: 2026, type: 'EXPENSE', total: '2500' },
      ]),
    })),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {},
        },
        {
          provide: StatisticsQueryBuilder,
          useValue: mockQueryBuilder,
        },
      ],
    }).compile()

    service = module.get<StatisticsService>(StatisticsService)
  })

  it('getStatistics: should compute spending by category with percentages', async () => {
    const result = await service.getStatistics(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.statistics.spendingByCategory).toHaveLength(2)
    expect(result.data.statistics.spendingByCategory[0].percentage).toBe(80) // 800/1000 * 100
    expect(result.data.statistics.spendingByCategory[1].percentage).toBe(20) // 200/1000 * 100
  })

  it('getStatistics: should build 6-month trend with correct months', async () => {
    const result = await service.getStatistics(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.statistics.monthlyTrend).toHaveLength(6)
    expect(result.data.statistics.monthlyTrend[0].month).toBe(10) // Oct 2025 (6 months back from Mar 2026)
  })
})
