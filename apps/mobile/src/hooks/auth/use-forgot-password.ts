import { useMutation } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { ForgotPasswordPayload } from '@/types/auth'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) =>
      FiniqAPI.auth.forgotPassword(data),
  })
}
