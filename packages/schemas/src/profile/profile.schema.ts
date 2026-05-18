import { z } from 'zod'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

import { noInvalidSpaces } from '../helpers'
import { type TranslateFunction } from '../types'

export const profileFormSchema = (t: TranslateFunction) =>
  z.object({
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
  })

export type ProfileFormValues = z.infer<ReturnType<typeof profileFormSchema>>
