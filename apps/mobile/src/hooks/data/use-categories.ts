import { useQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await FiniqAPI.categories.findAll({ perPage: 10 })

      return response.data?.data?.categories?.data ?? []
    },
  })
}
