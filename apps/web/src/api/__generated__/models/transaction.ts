import type { Category } from './category'
import type { TransactionType } from './transactionType'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: Date
  note?: string
  receiptPath?: string
  category?: Category
  createdAt: Date
  updatedAt: Date
}
