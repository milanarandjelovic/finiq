import type { SettingControllerFindAll200 } from '@/api/__generated__/models'
import { useSettingControllerFindAll } from '@/api/__generated__/settings/settings'

export const useCurrencyFormatter = () => {
  const { data: settingsResult } = useSettingControllerFindAll()
  const currency =
    (settingsResult?.data as SettingControllerFindAll200 | undefined)?.data
      ?.settings?.currency ?? 'USD'

  return (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
}
