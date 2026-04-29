import { useQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'

export const useTransactionsAll = () => {
  return useQuery({
    queryKey: ['transactions-all'],
    queryFn: async () => {
      const response = await FiniqAPI.transactions.findAll({ perPage: 10 })

      return response.data?.data?.transactions?.data ?? []
    },
  })
}
