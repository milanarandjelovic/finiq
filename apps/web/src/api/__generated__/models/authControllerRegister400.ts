import type { RegisterEmailExistsDto } from './registerEmailExistsDto'
import type { RegisterEmailUniqueDto } from './registerEmailUniqueDto'
import type { RegisterEmailValidDto } from './registerEmailValidDto'

export type AuthControllerRegister400 =
  | {
      statusCode?: number
      message?: string
      errors?: RegisterEmailExistsDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: RegisterEmailUniqueDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: RegisterEmailValidDto[]
    }
