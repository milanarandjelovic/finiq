import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z
    .string({ message: 'Enter a valid email' })
    .email({ message: 'Enter a valid email' }),
  password: z
    .string({ message: 'Password is required' })
    .min(1, { message: 'Password is required' }),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
