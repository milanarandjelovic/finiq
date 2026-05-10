import type { SettingControllerFindAll200 } from '@/api/__generated__/models'
import { useSettingControllerFindAll } from '@/api/__generated__/settings/settings'
import { unwrapApiResponse } from '@/lib/api-response'

export const useCurrencyFormatter = () => {
  const { data: settingsResult } = useSettingControllerFindAll()
  const currency =
    unwrapApiResponse<SettingControllerFindAll200>(settingsResult?.data)?.data
      ?.settings?.currency ?? 'USD'

  return (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
}
