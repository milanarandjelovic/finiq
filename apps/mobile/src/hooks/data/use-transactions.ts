import { useInfiniteQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { TransactionsFindAllQuery } from '@/types/transaction'

export const useTransactions = (params: TransactionsFindAllQuery) => {
  return useInfiniteQuery({
    queryKey: ['transactions', params],
    queryFn: async ({ pageParam }) => {
      const response = await FiniqAPI.transactions.findAll({
        ...params,
        currentPage: pageParam,
      })

      return response.data?.data?.transactions
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.meta?.pagination

      if (!pagination) {
        return undefined
      }

      return pagination.currentPage < pagination.lastPage
        ? pagination.currentPage + 1
        : undefined
    },
  })
}
