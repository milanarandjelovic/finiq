import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

import { IsMatchInterface } from '@/shared/decorators/is-match.decorator'

@ValidatorConstraint({ name: 'IsMatchConstraint', async: false })
@Injectable()
export class IsMatchConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { field }: IsMatchInterface = args.constraints[0]
    const fieldValue = (args.object as any)[field]

    if (!field) {
      return false
    }

    return value === fieldValue
  }

  defaultMessage(args?: ValidationArguments): string {
    const { field } = args.constraints[0]

    return `${args.property} and ${field} does not match.`
  }
}
