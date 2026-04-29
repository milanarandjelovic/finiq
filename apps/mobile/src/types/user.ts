import { type UserResponse } from '@/types/auth'

export type UpdateProfilePayload = {
  name: string
}

export type ChangePasswordPayload = {
  password: string
  newPassword: string
  passwordConfirmation: string
}

export type UserProfileResponse = {
  data: {
    user: UserResponse
  }
}
