import { type DataSource } from 'typeorm'
import { type Seeder } from 'typeorm-extension'

import { Budget } from '@/modules/budget/entities/budget.entity'
import { Category } from '@/modules/category/entities/category.entity'
import { User } from '@/modules/user/entities/user.entity'

const BUDGETED_CATEGORY_NAMES = [
  'Groceries',
  'Rent',
  'Transportation',
  'Dining Out',
  'Health',
  'Entertainment',
  'Clothing',
  'Subscriptions',
  'Utilities',
  'Fitness',
]

function getPastMonths(count: number): Array<{ year: number; month: number }> {
  const months: Array<{ year: number; month: number }> = []
  const now = new Date(2026, 3, 1) // April 2026

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  return months
}

export class BudgetSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding budgets')

    const userRepo = dataSource.getRepository(User)
    const categoryRepo = dataSource.getRepository(Category)
    const budgetRepo = dataSource.getRepository(Budget)
    const users = await userRepo.find()
    const months = getPastMonths(3)

    let totalBudgets = 0

    for (const user of users) {
      const categories = await categoryRepo.find({
        where: { user: { id: user.id } },
      })
      const expenseCategories = categories.filter((c) =>
        BUDGETED_CATEGORY_NAMES.includes(c.name),
      )
      const budgets: Partial<Budget>[] = []

      for (const { year, month } of months) {
        for (const category of expenseCategories) {
          // Add slight variation (+/- 10%) to budgetAmount per month to look realistic
          const variation = 1 + (Math.random() * 0.2 - 0.1)
          const amount = parseFloat(
            (Number(category.budgetAmount) * variation).toFixed(2),
          )

          const budget = new Budget()
          budget.user = user
          budget.category = category
          budget.year = year
          budget.month = month
          budget.amount = amount
          budgets.push(budget)
        }
      }

      await budgetRepo.save(budgets)
      totalBudgets += budgets.length
    }

    console.log(`${totalBudgets} budgets seeded for ${users.length} users`)
  }
}
