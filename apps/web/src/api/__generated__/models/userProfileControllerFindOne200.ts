import type { UserResponseDto } from './userResponseDto'

export type UserProfileControllerFindOne200 = {
  statusCode?: number
  message?: string
  data?: UserResponseDto
}
