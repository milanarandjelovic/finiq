export interface Category {
  id: string
  name: string
  emoji: string
  color: string
  budgetAmount: number
  isGoal: boolean
  targetAmount?: number
  targetDate?: Date
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}
