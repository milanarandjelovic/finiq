import { z } from 'zod'

import { noInvalidSpaces } from '../helpers'
import { type TranslateFunction } from '../types'

export const categoryFormSchema = (t: TranslateFunction) =>
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
    budgetAmount: z
      .string()
      .optional()
      .transform((val) =>
        val !== undefined && val !== '' ? Number(val) : undefined,
      )
      .pipe(z.number().min(0).optional()),
    isGoal: z.boolean().default(false),
  })

export type CategoryFormValues = z.infer<ReturnType<typeof categoryFormSchema>>
export type CategoryFormInput = z.input<ReturnType<typeof categoryFormSchema>>
