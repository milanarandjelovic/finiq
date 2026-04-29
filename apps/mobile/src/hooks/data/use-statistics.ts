import { useQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { StatisticsQuery } from '@/types/statistics'

export const useStatistics = (params: StatisticsQuery) => {
  return useQuery({
    queryKey: ['statistics', params],
    queryFn: async () => {
      const response = await FiniqAPI.statistics.get(params)

      return response.data?.data?.statistics ?? null
    },
  })
}
