import { applyDecorators } from '@nestjs/common'
import { Matches } from 'class-validator'

export function NoInvalidSpaces(): PropertyDecorator {
  return applyDecorators(
    Matches(/\S/, {
      message: 'Input should not be empty.',
    }),
    Matches(/^(?!.* {2})/, {
      message: 'Must not contain consecutive spaces.',
    }),
  )
}
