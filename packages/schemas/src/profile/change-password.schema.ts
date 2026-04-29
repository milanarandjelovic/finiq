import { z } from 'zod'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string({ message: 'Current password is required' })
      .min(1, { message: 'Current password is required' }),
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
    passwordConfirmation: z.string({
      message: 'Password confirmation is required',
    }),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>
