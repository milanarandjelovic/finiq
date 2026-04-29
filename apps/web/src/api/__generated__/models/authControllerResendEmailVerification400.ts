import type { ResendEmailVerificationUserNotFoundDto } from './resendEmailVerificationUserNotFoundDto'

export type AuthControllerResendEmailVerification400 = {
  statusCode?: number
  message?: string
  errors?: ResendEmailVerificationUserNotFoundDto[]
}
