import { useQuery } from '@tanstack/react-query'

import { PAGINATION_PAGE_LIMIT } from '@finiq/shared'
import { FiniqAPI } from '@/network/api'

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await FiniqAPI.categories.findAll({
        isGoal: 1,
        perPage: PAGINATION_PAGE_LIMIT,
      })

      return response.data?.data?.categories?.data ?? []
    },
  })
}
