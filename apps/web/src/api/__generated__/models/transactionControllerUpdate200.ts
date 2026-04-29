import type { TransactionResponseDto } from './transactionResponseDto'

export type TransactionControllerUpdate200 = {
  statusCode?: number
  message?: string
  data?: TransactionResponseDto
}
