import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'

export const useCategoryDelete = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => FiniqAPI.categories.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
