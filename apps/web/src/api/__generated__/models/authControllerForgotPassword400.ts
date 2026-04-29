import type { ForgotPasswordEmailNotEmptyDto } from './forgotPasswordEmailNotEmptyDto'
import type { ForgotPasswordEmailNotFoundDto } from './forgotPasswordEmailNotFoundDto'

export type AuthControllerForgotPassword400 =
  | {
      statusCode?: number
      message?: string
      errors?: ForgotPasswordEmailNotEmptyDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: ForgotPasswordEmailNotFoundDto[]
    }
