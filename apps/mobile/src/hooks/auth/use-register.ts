import { useMutation } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { RegisterPayload } from '@/types/auth'

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => FiniqAPI.auth.register(data),
  })
}
