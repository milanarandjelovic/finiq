export interface CreateCategoryPayloadDto {
  name: string
  emoji: string
  color: string
  budgetAmount?: number
  isGoal?: boolean
  targetAmount?: number
  targetDate?: string
  sortOrder?: number
}
