import { z } from 'zod'

export const goalFormSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, { message: 'Name is required' }),
  emoji: z
    .string({ message: 'Emoji is required' })
    .min(1, { message: 'Emoji is required' }),
  color: z
    .string({ message: 'Color is required' })
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Must be a hex color' }),
  targetAmount: z.coerce
    .number()
    .min(0.01, { message: 'Target amount is required' }),
  targetDate: z.string().optional(),
  budgetAmount: z.coerce.number().min(0).optional(),
  isGoal: z.boolean().default(true),
})

export type GoalFormValues = z.infer<typeof goalFormSchema>
