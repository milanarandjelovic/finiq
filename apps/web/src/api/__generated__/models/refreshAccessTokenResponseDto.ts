import type { User } from './user'

export interface RefreshAccessTokenResponseDto {
  user: User
  accessToken: string
}
