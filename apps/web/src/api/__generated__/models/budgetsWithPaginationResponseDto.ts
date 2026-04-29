import type { Budget } from './budget'
import type { PaginationDto } from './paginationDto'

export interface BudgetsWithPaginationResponseDto {
  data: Budget[]
  meta: PaginationDto
}
