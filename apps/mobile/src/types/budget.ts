import { type Category } from '@/types/category'

export type Budget = {
  id: string
  year: number
  month: number
  amount: number
  category: Category
  createdAt: string
  updatedAt: string
}

export type BudgetQuery = {
  year: number
  month: number
  currentPage?: number
  perPage?: number
}

export type UpsertBudgetPayload = {
  categoryId: string
  month: number
  year: number
  amount: number
}

export type CopyBudgetPayload = {
  year: number
  month: number
}

export type BudgetResponse = {
  data: {
    budget: Budget
  }
}

export type BudgetsResponse = {
  data: {
    budgets: {
      data: Budget[]
      meta: {
        pagination: {
          currentPage: number
          lastPage: number
          nextPage: number
          perPage: number
          previousPage: number
          total: number
        }
      }
    }
  }
}
