export const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'RSD', label: 'RSD - Serbian Dinar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
] as const

export type CurrencyValue = (typeof CURRENCIES)[number]['value']

export const CURRENCY_VALUES = CURRENCIES.map((c) => c.value) as CurrencyValue[]
