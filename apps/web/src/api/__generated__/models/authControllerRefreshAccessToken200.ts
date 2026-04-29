import type { RefreshAccessTokenResponseDto } from './refreshAccessTokenResponseDto'

export type AuthControllerRefreshAccessToken200 = {
  statusCode?: number
  message?: string
  data?: RefreshAccessTokenResponseDto
}
