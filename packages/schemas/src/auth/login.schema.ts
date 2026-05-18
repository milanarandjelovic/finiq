import { z } from 'zod'

import { type TranslateFunction } from '../types'

export const loginFormSchema = (t: TranslateFunction) =>
  z.object({
    email: z
      .string({ message: t('validation.emailNotEmpty') })
      .email({ message: t('validation.emailValid') }),
    password: z
      .string({ message: t('validation.passwordNotEmpty') })
      .min(1, { message: t('validation.passwordNotEmpty') }),
  })

export type LoginFormValues = z.infer<ReturnType<typeof loginFormSchema>>
