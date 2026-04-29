import { faker } from '@faker-js/faker'
import { type DataSource } from 'typeorm'
import { type Seeder } from 'typeorm-extension'

import { TransactionType } from '@finiq/shared'
import { Category } from '@/modules/category/entities/category.entity'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import { User } from '@/modules/user/entities/user.entity'

const EXPENSE_CATEGORY_NAMES = [
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

const INCOME_CATEGORY_NAMES = ['Salary', 'Freelance']

const CATEGORY_AMOUNT_RANGES: Record<string, [number, number]> = {
  Groceries: [30, 150],
  Rent: [800, 1500],
  Transportation: [10, 80],
  'Dining Out': [15, 60],
  Health: [20, 200],
  Entertainment: [10, 50],
  Clothing: [20, 150],
  Subscriptions: [8, 30],
  Utilities: [40, 150],
  Fitness: [20, 80],
  Salary: [3000, 6000],
  Freelance: [200, 1500],
}

const NOTES: Record<string, string[]> = {
  Groceries: [
    'Weekly groceries',
    'Supermarket run',
    'Farmers market',
    'Bulk shopping',
  ],
  Rent: ['Monthly rent', 'Rent payment'],
  Transportation: [
    'Gas refill',
    'Bus pass',
    'Uber ride',
    'Monthly transit pass',
    'Parking',
  ],
  'Dining Out': [
    'Lunch with team',
    'Date night',
    'Birthday dinner',
    'Coffee & pastry',
    'Takeaway',
  ],
  Health: [
    'Doctor visit',
    'Pharmacy',
    'Dentist checkup',
    'Eye exam',
    'Vitamins',
  ],
  Entertainment: [
    'Cinema tickets',
    'Concert',
    'Netflix',
    'Spotify',
    'Museum visit',
  ],
  Clothing: ['New shoes', 'Winter jacket', 'Work clothes', 'Online shopping'],
  Subscriptions: [
    'Netflix',
    'Spotify',
    'iCloud storage',
    'Adobe CC',
    'Gym membership',
  ],
  Utilities: ['Electricity bill', 'Internet bill', 'Water bill', 'Phone bill'],
  Fitness: ['Gym membership', 'Yoga class', 'Running shoes', 'Protein powder'],
  Salary: ['Monthly salary', 'Paycheck'],
  Freelance: ['Client project payment', 'Consulting fee', 'Freelance invoice'],
}

function randomAmount(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

function randomNote(categoryName: string): string | null {
  const notes = NOTES[categoryName]
  if (!notes || Math.random() < 0.2) return null
  return notes[Math.floor(Math.random() * notes.length)]
}

function randomDateInMonth(year: number, month: number): Date {
  const daysInMonth = new Date(year, month, 0).getDate()
  const day = Math.floor(Math.random() * daysInMonth) + 1
  return new Date(year, month - 1, day)
}

// Generate the last 6 months from April 2026
function getPastMonths(count: number): Array<{ year: number; month: number }> {
  const months: Array<{ year: number; month: number }> = []
  const now = new Date(2026, 3, 1) // April 2026

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  return months
}

export class TransactionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding transactions')

    const userRepo = dataSource.getRepository(User)
    const categoryRepo = dataSource.getRepository(Category)
    const transactionRepo = dataSource.getRepository(Transaction)
    const users = await userRepo.find()
    const months = getPastMonths(6)
    let totalTransactions = 0

    for (const user of users) {
      const categories = await categoryRepo.find({
        where: { user: { id: user.id } },
      })
      const expenseCategories = categories.filter((c) =>
        EXPENSE_CATEGORY_NAMES.includes(c.name),
      )
      const incomeCategories = categories.filter((c) =>
        INCOME_CATEGORY_NAMES.includes(c.name),
      )

      const transactions: Partial<Transaction>[] = []

      for (const { year, month } of months) {
        const salaryCategory = incomeCategories.find((c) => c.name === 'Salary')

        if (salaryCategory) {
          const t = new Transaction()
          t.type = TransactionType.INCOME
          t.amount = randomAmount(...CATEGORY_AMOUNT_RANGES['Salary'])
          t.date = new Date(year, month - 1, 25)
          t.note = randomNote('Salary')
          t.user = user
          t.category = null
          transactions.push(t)
        }

        if (Math.random() < 0.4) {
          const freelanceCategory = incomeCategories.find(
            (c) => c.name === 'Freelance',
          )

          if (freelanceCategory) {
            const t = new Transaction()
            t.type = TransactionType.INCOME
            t.amount = randomAmount(...CATEGORY_AMOUNT_RANGES['Freelance'])
            t.date = randomDateInMonth(year, month)
            t.note = randomNote('Freelance')
            t.user = user
            t.category = null
            transactions.push(t)
          }
        }

        for (const category of expenseCategories) {
          if (category.name === 'Rent') {
            const t = new Transaction()
            t.type = TransactionType.EXPENSE
            t.amount = randomAmount(...CATEGORY_AMOUNT_RANGES['Rent'])
            t.date = new Date(year, month - 1, 1)
            t.note = randomNote('Rent')
            t.user = user
            t.category = category
            transactions.push(t)
            continue
          }

          if (
            category.name === 'Subscriptions' ||
            category.name === 'Utilities'
          ) {
            const t = new Transaction()
            t.type = TransactionType.EXPENSE
            t.amount = randomAmount(...CATEGORY_AMOUNT_RANGES[category.name])
            t.date = randomDateInMonth(year, month)
            t.note = randomNote(category.name)
            t.user = user
            t.category = category
            transactions.push(t)
            continue
          }

          const count = faker.number.int({ min: 2, max: 5 })
          for (let i = 0; i < count; i++) {
            const t = new Transaction()
            t.type = TransactionType.EXPENSE
            t.amount = randomAmount(...CATEGORY_AMOUNT_RANGES[category.name])
            t.date = randomDateInMonth(year, month)
            t.note = randomNote(category.name)
            t.user = user
            t.category = category
            transactions.push(t)
          }
        }
      }

      await transactionRepo.save(transactions)
      totalTransactions += transactions.length
    }

    console.log(
      `${totalTransactions} transactions seeded for ${users.length} users`,
    )
  }
}
