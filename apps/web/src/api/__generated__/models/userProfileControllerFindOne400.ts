import type { UserNotFoundDto } from './userNotFoundDto'

export type UserProfileControllerFindOne400 = {
  statusCode?: number
  message?: string
  errors?: UserNotFoundDto
}
