import type { UserEmailExistsDto } from './userEmailExistsDto'
import type { UserEmailUniqueDto } from './userEmailUniqueDto'
import type { UserEmailValidDto } from './userEmailValidDto'
import type { UserNameMaxLengthDto } from './userNameMaxLengthDto'
import type { UserNameMinLengthDto } from './userNameMinLengthDto'
import type { UserNameNotValidDto } from './userNameNotValidDto'
import type { UserPasswordConfirmationMaxLengthDto } from './userPasswordConfirmationMaxLengthDto'
import type { UserPasswordConfirmationMinLengthDto } from './userPasswordConfirmationMinLengthDto'
import type { UserPasswordConfirmationNumberDto } from './userPasswordConfirmationNumberDto'
import type { UserPasswordConfirmationUppercaseDto } from './userPasswordConfirmationUppercaseDto'
import type { UserPasswordLowercaseDto } from './userPasswordLowercaseDto'
import type { UserPasswordMaxLengthDto } from './userPasswordMaxLengthDto'
import type { UserPasswordMinLengthDto } from './userPasswordMinLengthDto'
import type { UserPasswordNumberDto } from './userPasswordNumberDto'
import type { UserPasswordUppercaseDto } from './userPasswordUppercaseDto'

export type UserControllerUpdate400 =
  | {
      statusCode?: number
      message?: string
      errors?: UserNameMinLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNameMaxLengthDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNameNotValidDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserEmailExistsDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserEmailUniqueDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserEmailValidDto[]
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
      errors?: UserPasswordNumberDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserPasswordConfirmationUppercaseDto[]
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
      errors?: UserPasswordConfirmationNumberDto[]
    }
