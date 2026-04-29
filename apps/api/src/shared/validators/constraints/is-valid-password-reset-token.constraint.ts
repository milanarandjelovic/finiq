import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { EntityManager } from 'typeorm'

import { IsValidPasswordResetTokenInterface } from '@/shared/decorators/is-valid-password-reset-token.decorator'

@ValidatorConstraint({ name: 'IsValidPasswordResetToken', async: true })
@Injectable()
export class IsValidPasswordResetTokenConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { column }: IsValidPasswordResetTokenInterface = args.constraints[0]

    if (!column) {
      return false
    }

    const user = await this.entityManager
      .getRepository('users')
      .createQueryBuilder('users')
      .where({
        [column]: args.object[column],
      })
      .getOne()

    if (!user) {
      return false
    }

    const record = await this.entityManager
      .getRepository('password_resets')
      .createQueryBuilder('password_resets')
      .where({
        token: value,
        user,
      })
      .getOne()

    return record !== null
  }

  defaultMessage(): string {
    return 'Token is not valid.'
  }
}
