import { useMutation } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { ResetPasswordPayload } from '@/types/auth'

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) =>
      FiniqAPI.auth.resetPassword(data),
  })
}
