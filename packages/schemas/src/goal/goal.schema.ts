import { z } from 'zod'

import { noInvalidSpaces } from '../helpers'
import { type TranslateFunction } from '../types'

export const goalFormSchema = (t: TranslateFunction) =>
  z.object({
    name: z
      .string({ message: t('validation.nameNotEmpty') })
      .min(1, { message: t('validation.nameNotEmpty') })
      .superRefine(noInvalidSpaces(t)),
    emoji: z
      .string({ message: t('validation.emojiRequired') })
      .min(1, { message: t('validation.emojiRequired') }),
    color: z
      .string({ message: t('validation.colorRequired') })
      .regex(/^#[0-9A-Fa-f]{6}$/, { message: t('validation.colorHexInvalid') }),
    targetAmount: z
      .string()
      .transform(Number)
      .pipe(z.number().min(0.01, { message: t('validation.targetAmountMin') })),
    targetDate: z.string().optional(),
    budgetAmount: z
      .string()
      .optional()
      .transform((val) =>
        val !== undefined && val !== '' ? Number(val) : undefined,
      )
      .pipe(z.number().min(0).optional()),
    isGoal: z.boolean().default(true),
  })

export type GoalFormValues = z.infer<ReturnType<typeof goalFormSchema>>
export type GoalFormInput = z.input<ReturnType<typeof goalFormSchema>>
