import { useInfiniteQuery } from '@tanstack/react-query'

import { PAGINATION_PAGE_LIMIT } from '@finiq/shared'
import { FiniqAPI } from '@/network/api'
import type { BudgetQuery } from '@/types/budget'

export const useBudgets = (params: BudgetQuery) => {
  return useInfiniteQuery({
    queryKey: ['budgets', params],
    queryFn: async ({ pageParam }) => {
      const response = await FiniqAPI.budgets.findAll({
        ...params,
        currentPage: pageParam,
        perPage: PAGINATION_PAGE_LIMIT,
      })

      return response.data?.data?.budgets
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
