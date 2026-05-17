import { z } from 'zod'

import { type TranslateFunction } from '../types'

export const transactionFormSchema = (t: TranslateFunction) =>
  z.object({
    type: z.enum(['income', 'expense']),
    amount: z
      .string()
      .transform(Number)
      .pipe(z.number().min(0.01, { message: t('validation.amountMin') })),
    date: z
      .string({ message: t('validation.dateRequired') })
      .min(1, { message: t('validation.dateRequired') }),
    note: z.string().optional(),
    categoryId: z.string().optional(),
  })

export type TransactionFormValues = z.output<
  ReturnType<typeof transactionFormSchema>
>
export type TransactionFormInput = z.input<
  ReturnType<typeof transactionFormSchema>
>
