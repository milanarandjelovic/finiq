export type Setting = {
  currency: string
}

export type UpdateSettingPayload = {
  currency?: string
}

export type SettingResponse = {
  data: {
    settings: Setting
  }
}
