import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { EntityManager } from 'typeorm'

import { IsNotExistInterface } from '@/shared/decorators/is-not-exist.decorator'

@ValidatorConstraint({ name: 'IsNotExistConstraint', async: true })
@Injectable()
export class IsNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column }: IsNotExistInterface = args.constraints[0]

    if (!tableName || !column) {
      return false
    }

    const dataExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists()

    return dataExist
  }

  defaultMessage(args?: ValidationArguments): string {
    const column: string = args.property

    return `${column} entered is not exists.`
  }
}
