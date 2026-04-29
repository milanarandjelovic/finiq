import type { UserNotFoundDto } from './userNotFoundDto'

export type UserControllerFindOne400 = {
  statusCode?: number
  message?: string
  errors?: UserNotFoundDto
}
