export type UpdateSettingsPayloadDtoCurrency =
  (typeof UpdateSettingsPayloadDtoCurrency)[keyof typeof UpdateSettingsPayloadDtoCurrency]

export const UpdateSettingsPayloadDtoCurrency = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  RSD: 'RSD',
  CAD: 'CAD',
  AUD: 'AUD',
  CHF: 'CHF',
} as const
