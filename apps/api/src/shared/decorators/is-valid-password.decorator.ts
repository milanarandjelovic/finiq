import type { ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { IsValidPasswordConstraint } from '@/shared/validators/constraints/is-valid-password.constraint'

export type IsValidPasswordInterface = {
  column: string
}

export function IsValidPassword(
  options: IsValidPasswordInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsValidPasswordConstraint,
    })
  }
}
