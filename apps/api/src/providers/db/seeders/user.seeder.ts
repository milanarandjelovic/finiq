import { faker } from '@faker-js/faker'
import { type DataSource } from 'typeorm'
import { type Seeder } from 'typeorm-extension'

import { User } from '@/modules/user/entities/user.entity'

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding users')

    const userRepo = dataSource.getRepository(User)

    const users = Array.from({ length: 10 }, () => {
      const user = new User()
      user.name = faker.person.fullName()
      user.email = faker.internet.email()
      user.password = '1Jc1uE@1uKi7rx-='
      user.activatedAt = faker.date.recent()
      return user
    })

    await userRepo.save(users)

    console.log(`${users.length} users seeded`)
  }
}
