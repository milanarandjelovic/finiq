import { z } from 'zod'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

import { noInvalidSpaces } from '../helpers'
import { type TranslateFunction } from '../types'

export const registerFormSchema = (t: TranslateFunction) =>
  z
    .object({
      name: z
        .string({ message: t('validation.nameNotEmpty') })
        .min(GENERAL_VALIDATION_RULES.NAME_MIN_LENGTH, {
          message: t('validation.nameMinLength'),
        })
        .max(GENERAL_VALIDATION_RULES.NAME_MAX_LENGTH, {
          message: t('validation.nameMaxLength'),
        })
        .superRefine(noInvalidSpaces(t)),
      email: z
        .string({ message: t('validation.emailNotEmpty') })
        .email({ message: t('validation.emailValid') }),
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

export type RegisterFormValues = z.infer<ReturnType<typeof registerFormSchema>>
