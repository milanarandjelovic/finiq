import type { CategoryBreakdownItemDto } from './categoryBreakdownItemDto'

export interface DashboardDataDto {
  totalIncome: number
  totalExpenses: number
  balance: number
  /** Income minus all budget allocations */
  readyToAssign: number
  categoryBreakdown: CategoryBreakdownItemDto[]
}
