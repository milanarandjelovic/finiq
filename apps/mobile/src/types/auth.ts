export type TokenPayload = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  loginHandler: (tokens: TokenPayload) => Promise<void>
  logoutHandler: () => Promise<void>
}

export type UserResponse = {
  id: string
  name: string
  email: string
  activatedAt: string
  createdAt: string
  updatedAt: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  data: {
    user: UserResponse
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type RegisterResponse = {
  data: {
    user: UserResponse
  }
}

export type ForgotPasswordPayload = {
  email: string
}

export type ForgotPasswordResponse = {
  data: {
    user: UserResponse
  }
}

export type ResetPasswordPayload = {
  token: string
  email: string
  password: string
  passwordConfirmation: string
}

export type ResetPasswordResponse = {
  data: {
    user: UserResponse
  }
}
