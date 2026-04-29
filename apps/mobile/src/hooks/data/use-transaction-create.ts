import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { CreateTransactionPayload } from '@/types/transaction'

export const useTransactionCreate = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionPayload) =>
      FiniqAPI.transactions.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['transactions-all'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
