import { useQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await FiniqAPI.categories.findAll({ perPage: 10 })

      return (response.data?.data?.categories?.data ?? []).filter(
        (c) => c.isGoal,
      )
    },
  })
}
