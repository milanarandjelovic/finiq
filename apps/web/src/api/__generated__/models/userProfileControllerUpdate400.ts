import type { UserNameMaxLengthDto } from './userNameMaxLengthDto'
import type { UserNameMinLengthDto } from './userNameMinLengthDto'
import type { UserNameNotValidDto } from './userNameNotValidDto'
import type { UserNotFoundDto } from './userNotFoundDto'

export type UserProfileControllerUpdate400 =
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
      errors?: UserNotFoundDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserNameNotValidDto[]
    }
