import { applyDecorators } from '@nestjs/common'
import { Matches } from 'class-validator'

import { i18nMsg } from '@/shared/helpers/i18n-msg.helper'

export function NoInvalidSpaces(): PropertyDecorator {
  return applyDecorators(
    Matches(/\S/, {
      message: i18nMsg('validation.inputNotEmpty'),
    }),
    Matches(/^(?!.* {2})/, {
      message: i18nMsg('validation.noConsecutiveSpaces'),
    }),
  )
}
