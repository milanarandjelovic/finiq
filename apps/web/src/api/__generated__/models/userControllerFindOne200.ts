import type { UserResponseDto } from './userResponseDto'

export type UserControllerFindOne200 = {
  statusCode?: number
  message?: string
  data?: UserResponseDto
}
