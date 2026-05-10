import { z } from 'zod'

export const categoryFormSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, { message: 'Name is required' }),
  emoji: z
    .string({ message: 'Emoji is required' })
    .min(1, { message: 'Emoji is required' }),
  color: z
    .string({ message: 'Color is required' })
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color'),
  budgetAmount: z.coerce.number().min(0).optional(),
  isGoal: z.boolean().default(false),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
export type CategoryFormInput = z.input<typeof categoryFormSchema>
