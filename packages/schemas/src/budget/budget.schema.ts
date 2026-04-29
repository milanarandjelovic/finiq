import { z } from 'zod'

export const budgetFormSchema = z.object({
  amount: z.number().min(0, { message: 'Amount must be 0 or more' }),
})

export type BudgetFormValues = z.infer<typeof budgetFormSchema>
