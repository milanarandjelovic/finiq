import type { VerifyEmailTokenExpiredDto } from './verifyEmailTokenExpiredDto'
import type { VerifyEmailTokenNotFoundDto } from './verifyEmailTokenNotFoundDto'

export type AuthControllerVerifyEmail400 =
  | {
      statusCode?: number
      message?: string
      errors?: VerifyEmailTokenNotFoundDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: VerifyEmailTokenExpiredDto[]
    }
