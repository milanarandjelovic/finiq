import { z } from 'zod'

import { type TranslateFunction } from '../types'

export const forgotPasswordFormSchema = (t: TranslateFunction) =>
  z.object({
    email: z
      .string({ message: t('validation.emailNotEmpty') })
      .email({ message: t('validation.emailValid') }),
  })

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordFormSchema>
>
