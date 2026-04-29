import type { LoginResponseDto } from './loginResponseDto'

export type AuthControllerLogin200 = {
  statusCode?: number
  message?: string
  data?: LoginResponseDto
}
