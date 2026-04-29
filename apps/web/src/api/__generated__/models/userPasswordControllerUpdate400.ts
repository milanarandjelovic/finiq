import type { UserNewPasswordLowercaseDto } from './userNewPasswordLowercaseDto'
import type { UserNewPasswordMaxLengthDto } from './userNewPasswordMaxLengthDto'
import type { UserNewPasswordMinLengthDto } from './userNewPasswordMinLengthDto'
import type { UserNewPasswordNumberDto } from './userNewPasswordNumberDto'
import type { UserNewPasswordUppercaseDto } from './userNewPasswordUppercaseDto'
import type { UserNotFoundDto } from './userNotFoundDto'
import type { UserPasswordConfirmationLowercaseDto } from './userPasswordConfirmationLowercaseDto'
import type { UserPasswordConfirmationMaxLengthDto } from './userPasswordConfirmationMaxLengthDto'
import type { UserPasswordConfirmationMinLengthDto } from './userPasswordConfirmationMinLengthDto'
import type { UserPasswordConfirmationNumberDto } from './userPasswordConfirmationNumberDto'
import type { UserPasswordConfirmationUppercaseDto } from './userPasswordConfirmationUppercaseDto'
import type { UserPasswordLowercaseDto } from './userPasswordLowercaseDto'
import type { UserPasswordMaxLengthDto } from './userPasswordMaxLengthDto'
import type { UserPasswordMinLengthDto } from './userPasswordMinLengthDto'
import type { UserPasswordNumberDto } from './userPasswordNumberDto'
import type { UserPasswordUppercaseDto } from './userPasswordUppercaseDto'

export type UserPasswordControllerUpdate400 =
  | {
      statusCode?: number
      message?: string
      errors?: UserNotFoundDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordMinLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordMaxLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordLowercaseDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordUppercaseDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordNumberDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNewPasswordMinLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNewPasswordMaxLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNewPasswordLowercaseDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNewPasswordUppercaseDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNewPasswordNumberDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordConfirmationMinLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordConfirmationMaxLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordConfirmationLowercaseDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordConfirmationUppercaseDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordConfirmationNumberDto[]
    }
