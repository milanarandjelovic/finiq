import type { User } from './user'

export interface LoginResponseDto {
  user: User
  accessToken: string
  refreshToken: string
}
