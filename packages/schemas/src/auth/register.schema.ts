import { z } from 'zod'

import { GENERAL_VALIDATION_RULES } from '@finiq/shared'

export const registerFormSchema = z
  .object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' }),
    email: z
      .string({ message: 'Email is required' })
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

export type RegisterFormValues = z.infer<typeof registerFormSchema>
