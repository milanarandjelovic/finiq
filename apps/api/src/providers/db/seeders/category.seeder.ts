import { type DataSource } from 'typeorm'
import { type Seeder } from 'typeorm-extension'

import { Category } from '@/modules/category/entities/category.entity'
import { User } from '@/modules/user/entities/user.entity'

const EXPENSE_CATEGORIES = [
  {
    name: 'Groceries',
    emoji: '🛒',
    color: '#4CAF50',
    budgetAmount: 400,
    sortOrder: 1,
  },
  {
    name: 'Rent',
    emoji: '🏠',
    color: '#2196F3',
    budgetAmount: 1200,
    sortOrder: 2,
  },
  {
    name: 'Transportation',
    emoji: '🚗',
    color: '#FF9800',
    budgetAmount: 200,
    sortOrder: 3,
  },
  {
    name: 'Dining Out',
    emoji: '🍔',
    color: '#F44336',
    budgetAmount: 150,
    sortOrder: 4,
  },
  {
    name: 'Health',
    emoji: '💊',
    color: '#E91E63',
    budgetAmount: 100,
    sortOrder: 5,
  },
  {
    name: 'Entertainment',
    emoji: '🎬',
    color: '#9C27B0',
    budgetAmount: 80,
    sortOrder: 6,
  },
  {
    name: 'Clothing',
    emoji: '👗',
    color: '#00BCD4',
    budgetAmount: 100,
    sortOrder: 7,
  },
  {
    name: 'Subscriptions',
    emoji: '📱',
    color: '#607D8B',
    budgetAmount: 50,
    sortOrder: 8,
  },
  {
    name: 'Utilities',
    emoji: '⚡',
    color: '#FFC107',
    budgetAmount: 120,
    sortOrder: 9,
  },
  {
    name: 'Fitness',
    emoji: '🏋️',
    color: '#8BC34A',
    budgetAmount: 60,
    sortOrder: 10,
  },
] as const

const INCOME_CATEGORIES = [
  {
    name: 'Salary',
    emoji: '💼',
    color: '#388E3C',
    budgetAmount: 0,
    sortOrder: 11,
  },
  {
    name: 'Freelance',
    emoji: '💰',
    color: '#F57C00',
    budgetAmount: 0,
    sortOrder: 12,
  },
] as const

const GOAL_CATEGORY = {
  name: 'Vacation Fund',
  emoji: '✈️',
  color: '#3F51B5',
  budgetAmount: 0,
  isGoal: true,
  targetAmount: 3000,
  targetDate: new Date('2026-12-31'),
  sortOrder: 13,
} as const

export class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding categories')

    const userRepo = dataSource.getRepository(User)
    const categoryRepo = dataSource.getRepository(Category)
    const users = await userRepo.find()

    for (const user of users) {
      const categories: Partial<Category>[] = [
        ...EXPENSE_CATEGORIES.map((c) => ({
          ...c,
          user,
          isGoal: false,
          targetAmount: null,
          targetDate: null,
        })),
        ...INCOME_CATEGORIES.map((c) => ({
          ...c,
          user,
          isGoal: false,
          targetAmount: null,
          targetDate: null,
        })),
        { ...GOAL_CATEGORY, user },
      ]

      await categoryRepo.save(categories)
    }

    console.log(`Categories seeded for ${users.length} users`)
  }
}
