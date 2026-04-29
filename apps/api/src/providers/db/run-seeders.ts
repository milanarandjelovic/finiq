import { BudgetSeeder } from '@/providers/db/seeders/budget.seeder'
import { CategorySeeder } from '@/providers/db/seeders/category.seeder'
import { SettingSeeder } from '@/providers/db/seeders/setting.seeder'
import { TransactionSeeder } from '@/providers/db/seeders/transaction.seeder'
import { UserSeeder } from '@/providers/db/seeders/user.seeder'
import { DataSource } from '@/providers/db/typeorm.config'

// Seeder registry with name mapping
const SEEDERS = {
  user: { name: 'User', class: UserSeeder, order: 1 },
  category: { name: 'Category', class: CategorySeeder, order: 2 },
  setting: { name: 'Setting', class: SettingSeeder, order: 3 },
  transaction: { name: 'Transaction', class: TransactionSeeder, order: 4 },
  budget: { name: 'Budget', class: BudgetSeeder, order: 5 },
} as const

type SeederName = keyof typeof SEEDERS

interface SeederConfig {
  name: string
  class: new () => any
  order: number
}

async function runSeeder(seederConfig: SeederConfig) {
  const seeder = new seederConfig.class()
  console.log(`\n Running ${seederConfig.name} seeder...`)
  await seeder.run(DataSource)
  console.log(` ${seederConfig.name} seeder completed`)
}

async function truncateAll() {
  const tableNames = DataSource.entityMetadatas
    .map((meta) => `"${meta.tableName}"`)
    .join(', ')

  console.log(`  Truncating tables: ${tableNames}`)
  await DataSource.query(
    `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`,
  )
  console.log(' All tables truncated\n')
}

async function runSeeders(seederNames?: string[]) {
  try {
    console.log(' Initializing database connection...')
    await DataSource.initialize()
    console.log(' Database connected\n')

    if (args.includes('--fresh')) {
      await truncateAll()
    }

    let seedersToRun: SeederConfig[]

    if (
      !seederNames ||
      seederNames.length === 0 ||
      seederNames.includes('all')
    ) {
      // Run all seeders in order
      console.log(' Running all seeders in order...')
      seedersToRun = Object.values(SEEDERS).sort((a, b) => a.order - b.order)
    } else {
      // Run specific seeders
      const invalidNames: string[] = []
      const validSeeders: SeederConfig[] = []

      for (const name of seederNames) {
        const normalizedName = name.toLowerCase() as SeederName
        if (SEEDERS[normalizedName]) {
          validSeeders.push(SEEDERS[normalizedName])
        } else {
          invalidNames.push(name)
        }
      }

      if (invalidNames.length > 0) {
        console.error(` Invalid seeder name(s): ${invalidNames.join(', ')}`)
        console.log(`\n Available seeders: ${Object.keys(SEEDERS).join(', ')}`)
        process.exit(1)
      }

      // Sort by order even when running specific seeders
      seedersToRun = validSeeders.sort((a, b) => a.order - b.order)
      console.log(
        ` Running seeders: ${seedersToRun.map((s) => s.name).join(', ')}`,
      )
    }

    // Run each seeder
    for (const seederConfig of seedersToRun) {
      await runSeeder(seederConfig)
    }

    console.log('\n All seeders completed successfully!')
    await DataSource.destroy()
    console.log(' Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error('\n Error running seeders:', error)
    if (DataSource.isInitialized) {
      await DataSource.destroy()
    }
    process.exit(1)
  }
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
 Finiq Seeder Runner

Usage:
  npm run seed:dynamic                      # Run all seeders
  npm run seed:dynamic all                  # Run all seeders
  npm run seed:dynamic user                 # Run specific seeder

Available Seeders:
  - user            (UserSeeder - creates 10 users)
  - category        (CategorySeeder - creates expense/income/goal categories per user)
  - setting         (SettingSeeder - creates currency settings per user)
  - transaction     (TransactionSeeder - creates 6 months of transactions per user)
  - budget          (BudgetSeeder - creates 3 months of budgets per user)

Options:
  -h, --help   Show this help message
  --list       List all available seeders
  --fresh      Truncate all tables before seeding

Examples:
  npm run seed:dynamic
  npm run seed:dynamic -- --fresh
  npm run seed:dynamic -- --fresh user
  npm run seed:dynamic user
  npm run seed:dynamic category transaction
  `)
  process.exit(0)
}

if (args.includes('--list')) {
  console.log('\n Available Seeders:\n')
  Object.entries(SEEDERS)
    .sort((a, b) => a[1].order - b[1].order)
    .forEach(([key, config]) => {
      console.log(
        `  ${config.order}. ${key.padEnd(10)} - ${config.name} Seeder`,
      )
    })
  console.log('')
  process.exit(0)
}

// Run seeders with provided arguments (exclude flags)
const seederArgs = args.filter((arg) => !arg.startsWith('--'))
runSeeders(seederArgs.length > 0 ? seederArgs : undefined)
