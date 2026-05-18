'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { ServerCrash } from 'lucide-react'

import '@/assets/css/globals.css'

import i18next from '@/i18n'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <ServerCrash className="text-destructive h-10 w-10" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              {i18next.t('general.somethingWentWrong')}
            </h2>
            {error.digest && (
              <p className="text-muted-foreground font-mono text-xs">
                {error.digest}
              </p>
            )}
          </div>
          <button
            onClick={reset}
            className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {i18next.t('general.tryAgain')}
          </button>
        </div>
      </body>
    </html>
  )
}
