import { useQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { DashboardQuery } from '@/types/dashboard'

export const useDashboard = (params: DashboardQuery) => {
  return useQuery({
    queryKey: ['dashboard', params.year, params.month],
    queryFn: async () => {
      const response = await FiniqAPI.dashboard.get(params)

      return response.data?.data?.dashboard ?? null
    },
  })
}
