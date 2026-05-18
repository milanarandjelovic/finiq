import {
  createSentryConfig,
  isSentryEnabled,
  toSentryInitOptions,
} from '@finiq/sentry'
import * as Sentry from '@sentry/nextjs'

const config = createSentryConfig({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.SENTRY_ENABLED === 'true',
  environment: process.env.NODE_ENV ?? 'development',
  tracesSampleRate: 0,
  // profileLifecycle and enableLogs are not applicable to the Edge runtime
  sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
})

if (isSentryEnabled(config)) {
  Sentry.init(toSentryInitOptions(config))
}
