import type { HealthResponseDto } from './healthResponseDto'

export type AppControllerGetHealth200 = {
  statusCode?: number
  message?: string
  data?: HealthResponseDto
}
