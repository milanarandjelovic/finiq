import { z } from 'zod'

export const forgotPasswordFormSchema = z.object({
  email: z
    .string({ message: 'Enter a valid email' })
    .email({ message: 'Enter a valid email' }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>
