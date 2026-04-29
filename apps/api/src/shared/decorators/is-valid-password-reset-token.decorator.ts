import type { ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

import { IsValidPasswordResetTokenConstraint } from '@/shared/validators/constraints/is-valid-password-reset-token.constraint'

export type IsValidPasswordResetTokenInterface = {
  column: string
}

export function IsValidPasswordResetToken(
  options: IsValidPasswordResetTokenInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidPasswordResetToken',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsValidPasswordResetTokenConstraint,
    })
  }
}
