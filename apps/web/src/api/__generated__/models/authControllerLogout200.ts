import type { LogoutResponseDto } from './logoutResponseDto'

export type AuthControllerLogout200 = {
  statusCode?: number
  message?: string
  data?: LogoutResponseDto
}
