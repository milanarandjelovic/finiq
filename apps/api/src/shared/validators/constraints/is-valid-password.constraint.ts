import { Injectable } from '@nestjs/common'
import { compareSync } from 'bcrypt'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { EntityManager } from 'typeorm'

import { IsValidPasswordInterface } from '@/shared/decorators/is-valid-password.decorator'

@ValidatorConstraint({ name: 'IsValidPasswordConstraint', async: false })
@Injectable()
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { column }: IsValidPasswordInterface = args.constraints[0]

    if (!column) {
      return false
    }

    const user = await this.entityManager
      .getRepository('users')
      .createQueryBuilder('users')
      .where({
        [column]: args.object[column],
      })
      .addSelect('users.password')
      .getOne()

    if (!user) {
      return false
    }

    return compareSync(args.value, user.password)
  }

  defaultMessage(): string {
    return 'Invalid password.'
  }
}
