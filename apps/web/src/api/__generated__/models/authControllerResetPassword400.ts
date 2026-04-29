import type { ResetPasswordTokenExpiredDto } from './resetPasswordTokenExpiredDto'
import type { ResetPasswordTokenNotFoundDto } from './resetPasswordTokenNotFoundDto'

export type AuthControllerResetPassword400 =
  | {
      statusCode?: number
      message?: string
      errors?: ResetPasswordTokenNotFoundDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: ResetPasswordTokenExpiredDto[]
    }
