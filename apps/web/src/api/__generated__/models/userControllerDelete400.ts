import type { UserCannotDeleteYourselfDto } from './userCannotDeleteYourselfDto'
import type { UserNotFoundDto } from './userNotFoundDto'

export type UserControllerDelete400 =
  | {
      statusCode?: number
      message?: string
      errors?: UserNotFoundDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: UserCannotDeleteYourselfDto[]
    }
