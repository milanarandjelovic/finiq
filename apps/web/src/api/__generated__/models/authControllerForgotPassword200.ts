import type { ForgotPasswordResponseDto } from './forgotPasswordResponseDto'

export type AuthControllerForgotPassword200 = {
  statusCode?: number
  message?: string
  data?: ForgotPasswordResponseDto
}
