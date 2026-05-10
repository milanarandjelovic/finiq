'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <AlertCircle className="text-destructive h-10 w-10" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">
          {t('general.somethingWentWrong')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {error.message || t('errors.serverError')}
        </p>
      </div>
      <Button onClick={reset}>{t('general.tryAgain')}</Button>
    </div>
  )
}
