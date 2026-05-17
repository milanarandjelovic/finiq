import { z } from 'zod'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

import { type TranslateFunction } from '../types'

export const changePasswordFormSchema = (t: TranslateFunction) =>
  z
    .object({
      currentPassword: z
        .string({ message: t('validation.currentPasswordNotEmpty') })
        .min(1, { message: t('validation.currentPasswordNotEmpty') }),
      password: z
        .string({ message: t('validation.passwordNotEmpty') })
        .min(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
          message: t('validation.passwordMinLength'),
        })
        .regex(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_UPPERCASE), {
          message: t('validation.passwordRegexUppercase'),
        })
        .regex(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_NUMBER), {
          message: t('validation.passwordRegexNumber'),
        }),
      passwordConfirmation: z.string({
        message: t('validation.passwordConfirmationNotEmpty'),
      }),
    })
    .refine((d) => d.password === d.passwordConfirmation, {
      message: t('validation.passwordConfirmationMustMatch'),
      path: ['passwordConfirmation'],
    })

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof changePasswordFormSchema>
>
