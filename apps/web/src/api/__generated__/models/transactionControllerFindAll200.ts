import type { TransactionsResponseDto } from './transactionsResponseDto'

export type TransactionControllerFindAll200 = {
  statusCode?: number
  message?: string
  data?: TransactionsResponseDto
}
