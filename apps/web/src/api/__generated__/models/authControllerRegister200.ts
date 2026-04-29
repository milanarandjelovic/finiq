import type { RegisterResponseDto } from './registerResponseDto'

export type AuthControllerRegister200 = {
  statusCode?: number
  message?: string
  data?: RegisterResponseDto
}
