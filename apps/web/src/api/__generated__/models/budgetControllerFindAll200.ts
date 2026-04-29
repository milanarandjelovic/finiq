import type { BudgetsResponseDto } from './budgetsResponseDto'

export type BudgetControllerFindAll200 = {
  statusCode?: number
  message?: string
  data?: BudgetsResponseDto
}
