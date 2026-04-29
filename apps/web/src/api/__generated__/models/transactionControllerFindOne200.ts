import type { TransactionResponseDto } from './transactionResponseDto'

export type TransactionControllerFindOne200 = {
  statusCode?: number
  message?: string
  data?: TransactionResponseDto
}
