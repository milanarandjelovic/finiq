import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'

export const useTransactionDelete = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => FiniqAPI.transactions.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['transactions-all'] })
    },
  })
}
