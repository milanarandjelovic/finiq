import { z } from 'zod'

export const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().min(0.01, 'Amount must be > 0'),
  date: z.string({ message: 'Date is required' }),
  note: z.string().optional(),
  categoryId: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>
