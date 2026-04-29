export type StatisticsQuery = {
  year: number
  month: number
}

export type SpendingByCategoryItem = {
  categoryId: string
  name: string
  emoji: string
  color: string
  amount: number
  percentage: number
}

export type MonthlyTrendItem = {
  month: number
  year: number
  income: number
  expenses: number
}

export type StatisticsData = {
  spendingByCategory: SpendingByCategoryItem[]
  monthlyTrend: MonthlyTrendItem[]
}

export type StatisticsResponse = {
  data: {
    statistics: StatisticsData
  }
}
