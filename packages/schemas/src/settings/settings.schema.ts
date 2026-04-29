import { z } from 'zod'

import { CURRENCIES, type CurrencyValue } from '@finiq/shared'

const currencyValues = CURRENCIES.map((c) => c.value) as [
  CurrencyValue,
  ...CurrencyValue[],
]

export const settingsFormSchema = z.object({
  currency: z.enum(currencyValues),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
