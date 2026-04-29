import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { UpdateCategoryPayload } from '@/types/category'

export const useCategoryUpdate = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      FiniqAPI.categories.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
