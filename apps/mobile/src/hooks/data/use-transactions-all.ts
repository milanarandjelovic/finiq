import { useQuery } from '@tanstack/react-query'

import { PAGINATION_PAGE_LIMIT } from '@finiq/shared'
import { FiniqAPI } from '@/network/api'

export const useTransactionsAll = () => {
  return useQuery({
    queryKey: ['transactions-all'],
    queryFn: async () => {
      const response = await FiniqAPI.transactions.findAll({
        perPage: PAGINATION_PAGE_LIMIT,
      })

      return response.data?.data?.transactions?.data ?? []
    },
  })
}
