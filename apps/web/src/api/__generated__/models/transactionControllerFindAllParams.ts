import type { TransactionControllerFindAllType } from './transactionControllerFindAllType'

export type TransactionControllerFindAllParams = {
  month?: number
  year?: number
  type?: TransactionControllerFindAllType
  categoryId?: string
  categoryName?: string
  currentPage?: number
  perPage?: number
}
