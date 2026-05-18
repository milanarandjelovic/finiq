import type { SentryUser } from '@finiq/sentry'
import { Injectable } from '@nestjs/common'
import * as Sentry from '@sentry/nestjs'

type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug'

@Injectable()
export class SentryService {
  captureException(error: unknown, context?: Record<string, unknown>): void {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setExtras(context)
      }

      Sentry.captureException(error)
    })
  }

  captureMessage(message: string, level: SeverityLevel = 'info'): void {
    Sentry.captureMessage(message, level)
  }

  setUser(user: SentryUser | null): void {
    Sentry.setUser(user)
  }

  setTag(key: string, value: string): void {
    Sentry.setTag(key, value)
  }
}
