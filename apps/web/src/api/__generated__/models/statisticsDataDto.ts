import type { MonthlyTrendItemDto } from './monthlyTrendItemDto'
import type { SpendingByCategoryItemDto } from './spendingByCategoryItemDto'

export interface StatisticsDataDto {
  spendingByCategory: SpendingByCategoryItemDto[]
  monthlyTrend: MonthlyTrendItemDto[]
}
