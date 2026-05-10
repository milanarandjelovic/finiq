import { useQuery } from '@tanstack/react-query'

import { PAGINATION_PAGE_LIMIT } from '@finiq/shared'
import { FiniqAPI } from '@/network/api'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await FiniqAPI.categories.findAll({
        perPage: PAGINATION_PAGE_LIMIT,
      })

      return response.data?.data?.categories?.data ?? []
    },
  })
}
