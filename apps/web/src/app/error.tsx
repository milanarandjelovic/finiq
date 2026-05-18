'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { ServerCrash } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="bg-destructive/10 rounded-full p-4">
        <ServerCrash className="text-destructive h-10 w-10" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {t('general.somethingWentWrong')}
        </h2>
        {error.digest && (
          <p className="text-muted-foreground font-mono text-xs">
            {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset} variant="outline">
        {t('general.tryAgain')}
      </Button>
    </div>
  )
}
