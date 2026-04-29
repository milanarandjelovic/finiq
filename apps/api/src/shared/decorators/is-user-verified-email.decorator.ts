import type { ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { IsUserVerifiedEmailConstraint } from '@/shared/validators/constraints/is-user-verified-email.constraint'

export type IsUserVerifiedEmailInterface = {
  column: string
}

export function IsUserVerifiedEmail(
  options: IsUserVerifiedEmailInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserVerifiedEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUserVerifiedEmailConstraint,
    })
  }
}
