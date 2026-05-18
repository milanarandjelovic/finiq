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
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  enableLogs: process.env.SENTRY_ENABLE_LOGS === 'true',
  profileLifecycle:
    (process.env.SENTRY_PROFILE_LIFECYCLE as 'trace' | 'manual') ?? 'trace',
  sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
})

if (isSentryEnabled(config)) {
  Sentry.init({
    ...toSentryInitOptions(config),
    debug: true, // TODO: remove before committing — prints [Sentry] logs to server console
  })
}
