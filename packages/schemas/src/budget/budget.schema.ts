import { z } from 'zod'

import { type TranslateFunction } from '../types'

export const budgetFormSchema = (t: TranslateFunction) =>
  z.object({
    amount: z.number().min(0, { message: t('validation.budgetAmountMin') }),
  })

export type BudgetFormValues = z.infer<ReturnType<typeof budgetFormSchema>>
