import { z } from 'zod'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

export const resetPasswordFormSchema = z
  .object({
    email: z
      .string({ message: 'Enter a valid email' })
      .email({ message: 'Enter a valid email' }),
    password: z
      .string({ message: 'Password is required' })
      .min(GENERAL_VALIDATION_RULES.PASSWORD_MIN_LENGTH, {
        message: 'At least 8 characters',
      })
      .regex(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_UPPERCASE), {
        message: 'Must contain an uppercase letter',
      })
      .regex(new RegExp(GENERAL_VALIDATION_RULES.PASSWORD_REGEX_NUMBER), {
        message: 'Must contain a number',
      }),
    passwordConfirmation: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
