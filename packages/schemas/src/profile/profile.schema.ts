import { z } from 'zod'

export const profileFormSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string({ message: 'Email is required' })
    .email('Enter a valid email'),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
