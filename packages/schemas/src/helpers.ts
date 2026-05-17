import { z } from 'zod'

import { type TranslateFunction } from './types'

export const noInvalidSpaces =
  (t: TranslateFunction) => (val: string, ctx: z.RefinementCtx) => {
    if (val.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: t('validation.inputNotEmpty'),
      })
    }

    if (/ {2,}/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: t('validation.noConsecutiveSpaces'),
      })
    }
  }
