import {
  createSentryConfig,
  isSentryEnabled,
  SENTRY_DEFAULT_IGNORE_ERRORS,
  toSentryInitOptions,
} from '@finiq/sentry'
import * as Sentry from '@sentry/nextjs'

const config = createSentryConfig({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
  environment: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  tracesSampleRate: parseFloat(
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1',
  ),
})

if (isSentryEnabled(config)) {
  Sentry.init({
    ...toSentryInitOptions(config),
    debug: true, // TODO: remove before committing — prints [Sentry] logs to browser console
    ignoreErrors: SENTRY_DEFAULT_IGNORE_ERRORS,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration()],
  })
}
