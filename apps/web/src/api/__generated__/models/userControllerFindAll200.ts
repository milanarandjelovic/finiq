import type { UsersFindAllResponseDto } from './usersFindAllResponseDto'

export type UserControllerFindAll200 = {
  statusCode?: number
  message?: string
  data?: UsersFindAllResponseDto
}
