import { faker } from '@faker-js/faker'
import { type DataSource } from 'typeorm'
import { type Seeder } from 'typeorm-extension'

import { User } from '@/modules/user/entities/user.entity'

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding users')

    const userRepo = dataSource.getRepository(User)

    const e2eUser = new User()
    e2eUser.name = 'Test User'
    e2eUser.email = 'info@email.com'
    e2eUser.password = '1Jc1uE@1uKi7rx-='
    e2eUser.activatedAt = new Date()

    const randomUsers = Array.from({ length: 10 }, () => {
      const user = new User()
      user.name = faker.person.fullName()
      user.email = faker.internet.email()
      user.password = '1Jc1uE@1uKi7rx-='
      user.activatedAt = faker.date.recent()
      return user
    })

    await userRepo.save([e2eUser, ...randomUsers])

    console.log(`${randomUsers.length + 1} users seeded`)
  }
}
