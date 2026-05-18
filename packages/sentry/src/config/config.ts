import type { SentryConfig, SentryInitOptions } from '../types/sentry'

/**
 * Creates a SentryConfig object with default values.
 *
 * @param {SentryConfig} options - The options to create the config from.
 * @returns {SentryConfig} The created SentryConfig object.
 */
export function createSentryConfig(options: {
  dsn?: string
  enabled?: boolean
  environment?: string
  tracesSampleRate?: number
  release?: string
  enableLogs?: boolean
  profileLifecycle?: 'trace' | 'manual'
  sendDefaultPii?: boolean
}): SentryConfig {
  return {
    dsn: options.dsn ?? '',
    enabled: options.enabled ?? false,
    environment: options.environment ?? 'development',
    tracesSampleRate: parseFloat(String(options.tracesSampleRate || 0.1)),
    release: options.release,
    enableLogs: options.enableLogs ?? false,
    profileLifecycle: options.profileLifecycle,
    sendDefaultPii: options.sendDefaultPii ?? false,
  }
}

/**
 * Checks if Sentry is enabled based on the provided config.
 *
 * @param {SentryConfig} config - The Sentry configuration.
 * @returns {boolean} True if Sentry is enabled, false otherwise.
 */
export function isSentryEnabled(config: SentryConfig): boolean {
  return config.enabled && !!config.dsn
}

/**
 * Maps SentryConfig to the safe shape for Sentry.init().
 * Never spread SentryConfig directly - use this function instead.
 *
 * @param {SentryConfig} config - The Sentry configuration.
 * @returns {SentryInitOptions} The safe Sentry initialization options.
 */
export function toSentryInitOptions(config: SentryConfig): SentryInitOptions {
  return {
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    tracesSampleRate: config.tracesSampleRate,
    profileLifecycle: config.profileLifecycle,
    sendDefaultPii: config.sendDefaultPii,
    _experiments: { enableLogs: config.enableLogs },
  }
}
