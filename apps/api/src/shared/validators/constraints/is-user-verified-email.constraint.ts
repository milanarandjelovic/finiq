import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { EntityManager } from 'typeorm'

import { IsUserVerifiedEmailInterface } from '@/shared/decorators/is-user-verified-email.decorator'

@ValidatorConstraint({ name: 'IsUserVerifiedEmail', async: true })
@Injectable()
export class IsUserVerifiedEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { column }: IsUserVerifiedEmailInterface = args.constraints[0]

    if (!column) {
      return false
    }

    const user = await this.entityManager
      .getRepository('users')
      .createQueryBuilder('users')
      .where({
        [column]: value,
      })
      .getOne()

    return !(user && user.activatedAt)
  }

  defaultMessage(): string {
    return 'Email is already verified.'
  }
}
