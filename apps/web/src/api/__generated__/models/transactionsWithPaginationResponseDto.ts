import type { PaginationDto } from './paginationDto'
import type { Transaction } from './transaction'

export interface TransactionsWithPaginationResponseDto {
  data: Transaction[]
  meta: PaginationDto
}
