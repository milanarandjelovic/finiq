import type { ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { IsMatchConstraint } from '@/shared/validators/constraints/is-match.constraint'

export type IsMatchInterface = {
  field: string
}

export function IsMatch(
  options: IsMatchInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsMatch',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsMatchConstraint,
    })
  }
}
