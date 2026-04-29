import type { LoginEmailNotActivatedDto } from './loginEmailNotActivatedDto'
import type { LoginEmailNotFoundDto } from './loginEmailNotFoundDto'

export type AuthControllerLogin400 =
  | {
      statusCode?: number
      message?: string
      errors?: LoginEmailNotFoundDto[]
    }
  | {
      statusCode?: number
      message?: string
      errors?: LoginEmailNotActivatedDto[]
    }
