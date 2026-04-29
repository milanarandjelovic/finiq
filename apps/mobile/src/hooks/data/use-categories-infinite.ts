import { useInfiniteQuery } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'

interface Params {
  isGoal?: number
  name?: string
}

export const useCategoriesInfinite = (params: Params) => {
  return useInfiniteQuery({
    queryKey: ['categories', params],
    queryFn: async ({ pageParam }) => {
      const response = await FiniqAPI.categories.findAll({
        ...params,
        currentPage: pageParam,
        perPage: 10,
      })
      return response.data?.data?.categories
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.meta?.pagination
      if (!pagination) return undefined
      return pagination.currentPage < pagination.lastPage
        ? pagination.currentPage + 1
        : undefined
    },
  })
}
