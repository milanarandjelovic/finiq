import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { UpsertBudgetPayload } from '@/types/budget'

export const useBudgetUpsert = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertBudgetPayload) => FiniqAPI.budgets.upsert(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
