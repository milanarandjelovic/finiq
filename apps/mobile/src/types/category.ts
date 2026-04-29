export type Category = {
  id: string
  name: string
  emoji: string
  color: string
  budgetAmount: number
  isGoal: boolean
  targetAmount?: number
  targetDate?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CategoriesFindAllQuery = {
  isGoal?: number
  name?: string
  currentPage?: number
  perPage?: number
}

export type CreateCategoryPayload = {
  name: string
  emoji: string
  color: string
  budgetAmount?: number
  isGoal?: boolean
  targetAmount?: number
  targetDate?: string
  sortOrder?: number
}

export type UpdateCategoryPayload = {
  name?: string
  emoji?: string
  color?: string
  budgetAmount?: number
  isGoal?: boolean
  targetAmount?: number
  targetDate?: string
  sortOrder?: number
}

export type CategoryResponse = {
  data: {
    category: Category
  }
}

export type CategoriesResponse = {
  data: {
    categories: {
      data: Category[]
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
