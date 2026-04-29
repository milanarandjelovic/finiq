import { useSettings } from '@/hooks/data/use-settings'

export function useCurrencyFormatter() {
  const { data: settings } = useSettings()
  const currency = settings?.currency ?? 'USD'

  return (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
      amount,
    )
}
