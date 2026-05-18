export interface SentryConfig {
  dsn: string
  enabled: boolean
  environment: string
  tracesSampleRate: number
  release?: string
  enableLogs?: boolean
  profileLifecycle?: 'trace' | 'manual'
  sendDefaultPii?: boolean
}

/**
 * Safe subset for Sentry.init() - excludes internal-only fields.
 * Never spread SentryConfig directly into Sentry.init(): `enabled` is not
 * an SDK option and `enableLogs` maps to _experiments.enableLogs.
 */
export type SentryInitOptions = Omit<SentryConfig, 'enabled' | 'enableLogs'> & {
  _experiments?: { enableLogs?: boolean }
}

export interface SentryUser {
  id: string
  email: string
  username?: string
}
