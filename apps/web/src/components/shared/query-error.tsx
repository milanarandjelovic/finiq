'use client'

import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'

interface QueryErrorProps {
  message?: string
  onRetry?: () => void
}

export function QueryError({ message, onRetry }: QueryErrorProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertCircle className="text-destructive h-8 w-8" />
      <p
        className="text-muted-foreground text-sm"
        data-testid="query-error-message"
      >
        {message ?? t('general.somethingWentWrong')}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          data-testid="query-error-retry"
        >
          {t('general.tryAgain')}
        </Button>
      )}
    </div>
  )
}
