import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { StatisticsQueryBuilder } from '@/modules/statistics/builders/statistics-query.builder'
import { StatisticsService } from '@/modules/statistics/services/statistics.service'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

describe('StatisticsService', () => {
  let service: StatisticsService

  function buildModule(overrides: { spending?: any[]; trend?: any[] }) {
    const {
      spending = [
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
      ],
      trend = [
        { month: 1, year: 2026, type: 'income', total: '5000' },
        { month: 1, year: 2026, type: 'expense', total: '3000' },
        { month: 2, year: 2026, type: 'income', total: '4500' },
        { month: 2, year: 2026, type: 'expense', total: '2500' },
      ],
    } = overrides

    const mockQueryBuilder = {
      spendingByCategory: jest.fn(() => ({
        getRawMany: jest.fn().mockResolvedValue(spending),
      })),
      monthlyTrend: jest.fn(() => ({
        getRawMany: jest.fn().mockResolvedValue(trend),
      })),
    }

    return Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: getRepositoryToken(Transaction), useValue: {} },
        { provide: StatisticsQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile()
  }

  it('getStatistics: should compute spending by category with percentages', async () => {
    const module = await buildModule({})
    service = module.get<StatisticsService>(StatisticsService)
    const result = await service.getStatistics(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.statistics.spendingByCategory).toHaveLength(2)
    expect(result.data.statistics.spendingByCategory[0].percentage).toBe(80)
    expect(result.data.statistics.spendingByCategory[1].percentage).toBe(20)
  })

  it('getStatistics: should build 6-month trend including year wrap-around', async () => {
    const module = await buildModule({})
    service = module.get<StatisticsService>(StatisticsService)
    // month=2 means going back crosses into December of previous year (m=0 case triggers)
    const result = await service.getStatistics(
      { month: 2, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.statistics.monthlyTrend).toHaveLength(6)
    const firstEntry = result.data.statistics.monthlyTrend[0]
    expect(firstEntry.month).toBe(9)
    expect(firstEntry.year).toBe(2025)
  })

  it('getStatistics: should set percentage to 0 when total spent is 0', async () => {
    const module = await buildModule({ spending: [] })
    service = module.get<StatisticsService>(StatisticsService)
    const result = await service.getStatistics(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.statistics.spendingByCategory).toHaveLength(0)
  })

  it('getStatistics: percentage is 0 when spending rows exist but all amounts are zero', async () => {
    const module = await buildModule({
      spending: [
        {
          categoryId: 'cat-1',
          name: 'Food',
          emoji: '🍔',
          color: '#ff0000',
          amount: '0',
        },
      ],
    })
    service = module.get<StatisticsService>(StatisticsService)
    const result = await service.getStatistics(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.statistics.spendingByCategory[0].percentage).toBe(0)
  })

  it('getStatistics: months with no matching trend rows default to 0', async () => {
    const module = await buildModule({ trend: [] })
    service = module.get<StatisticsService>(StatisticsService)
    const result = await service.getStatistics(
      { month: 3, year: 2026 } as any,
      'user-1',
    )

    const trend = result.data.statistics.monthlyTrend
    expect(trend.every((t) => t.income === 0 && t.expenses === 0)).toBe(true)
  })

  it('getStatistics: month=1 triggers year rollback to previous year', async () => {
    const module = await buildModule({})
    service = module.get<StatisticsService>(StatisticsService)
    // month=1 means going back 2+ months triggers m=0 → m=12, y--
    const result = await service.getStatistics(
      { month: 1, year: 2026 } as any,
      'user-1',
    )

    expect(result.data.statistics.monthlyTrend).toHaveLength(6)
    const months = result.data.statistics.monthlyTrend.map((t) => t.month)
    expect(months).toContain(8) // Aug 2025
    expect(months).toContain(12) // Dec 2025
  })
})
