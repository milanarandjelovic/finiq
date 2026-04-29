import { useQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await FiniqAPI.settings.findAll()

      return response.data?.data?.settings ?? null
    },
  })
}
