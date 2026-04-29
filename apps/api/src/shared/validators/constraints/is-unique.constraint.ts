import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { EntityManager } from 'typeorm'

import { IsUniqueInterface } from '@/shared/decorators/is-unique.decorator'

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column }: IsUniqueInterface = args.constraints[0]

    if (!tableName || !column) {
      return false
    }

    const dataExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where(`LOWER(${column}) = LOWER(:value)`, { value })
      .getExists()

    return !dataExist
  }

  defaultMessage(args?: ValidationArguments): string {
    const column: string = args.property

    return `${column} is already exist.`
  }
}
