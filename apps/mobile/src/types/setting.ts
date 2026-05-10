import type { CurrencyValue } from '@finiq/shared'

export type Setting = {
  currency: CurrencyValue
}

export type UpdateSettingPayload = {
  currency?: CurrencyValue
}

export type SettingResponse = {
  data: {
    settings: Setting
  }
}
