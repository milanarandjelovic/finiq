import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FiniqAPI } from '@/network/api'
import type { UpdateSettingPayload } from '@/types/setting'

export const useSettingsUpdate = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSettingPayload) => FiniqAPI.settings.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}
