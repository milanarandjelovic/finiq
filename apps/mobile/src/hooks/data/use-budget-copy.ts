import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { CopyBudgetPayload } from '@/types/budget'

export const useBudgetCopy = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CopyBudgetPayload) =>
      FiniqAPI.budgets.copyFromPreviousMonth(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}
