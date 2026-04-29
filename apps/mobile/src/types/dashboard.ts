export type DashboardQuery = {
  year: number
  month: number
}

export type DashboardData = {
  totalIncome: number
  totalExpenses: number
  balance: number
  readyToAssign: number
  categoryBreakdown: {
    categoryId: string
    name: string
    emoji: string
    color: string
    budgeted: number
    spent: number
    available: number
  }[]
}

export type DashboardResponse = {
  data: {
    dashboard: DashboardData
  }
}
