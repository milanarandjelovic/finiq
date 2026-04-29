import type { Category } from './category'

export interface Budget {
  id: string
  year: number
  month: number
  amount: number
  category: Category
  createdAt: Date
  updatedAt: Date
}
