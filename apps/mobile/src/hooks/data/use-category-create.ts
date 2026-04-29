import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { CreateCategoryPayload } from '@/types/category'

export const useCategoryCreate = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryPayload) =>
      FiniqAPI.categories.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
