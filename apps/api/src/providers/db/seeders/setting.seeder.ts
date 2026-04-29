import { type DataSource } from 'typeorm'
import { type Seeder } from 'typeorm-extension'

import { Setting } from '@/modules/setting/entities/setting.entity'
import { User } from '@/modules/user/entities/user.entity'

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'USD',
  'USD',
  'CAD',
  'AUD',
  'CHF',
  'USD',
  'EUR',
]

export class SettingSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding settings')

    const userRepo = dataSource.getRepository(User)
    const settingRepo = dataSource.getRepository(Setting)

    const users = await userRepo.find()

    const settings: Partial<Setting>[] = users.map((user, index) => {
      const setting = new Setting()
      setting.user = user
      setting.key = 'currency'
      setting.value = CURRENCIES[index % CURRENCIES.length]

      return setting
    })

    await settingRepo.save(settings)

    console.log(`Settings seeded for ${users.length} users`)
  }
}
