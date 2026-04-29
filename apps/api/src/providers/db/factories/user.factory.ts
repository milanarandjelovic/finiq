import type { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'

import { User } from '@/modules/user/entities/user.entity'

export default setSeederFactory(User, (faker: Faker) => {
  const user = new User()
  user.name = faker.person.fullName()
  user.email = faker.internet.email()
  user.password = '1Jc1uE@1uKi7rx-='
  user.activatedAt = faker.date.recent()
  user.createdAt = faker.date.recent()

  return user
})
