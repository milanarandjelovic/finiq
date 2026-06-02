import { z } from 'zod'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

import { type TranslateFunction } from '../types'

export const loginFormSchema = (t: TranslateFunction) =>
  z.object({
    email: z
      .string({ message: t('validation.emailNotEmpty') })
      .email({ message: t('validation.emailValid') }),
    password: z
      .string({ message: t('validation.passwordNotEmpty') })
      .min(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
        message: t('validation.passwordMinLength'),
      }),
  })

export type LoginFormValues = z.infer<ReturnType<typeof loginFormSchema>>
