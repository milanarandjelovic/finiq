import type { ResetPasswordResponseDto } from './resetPasswordResponseDto'

export type AuthControllerResetPassword200 = {
  statusCode?: number
  message?: string
  data?: ResetPasswordResponseDto
}
