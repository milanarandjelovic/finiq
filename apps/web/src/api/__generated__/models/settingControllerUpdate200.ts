import type { SettingsResponseDto } from './settingsResponseDto'

export type SettingControllerUpdate200 = {
  statusCode?: number
  message?: string
  data?: SettingsResponseDto
}
