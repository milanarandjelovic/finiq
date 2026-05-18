/**
 * Default error messages to ignore in Sentry, as they are often caused by
 * user actions or expected conditions, rather than actual bugs in the
 * backend.
 */
export const SENTRY_DEFAULT_IGNORE_ERRORS: string[] = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications',
  'Non-Error promise rejection captured',
  'Network Error',
  'Request aborted',
  'timeout of 0ms exceeded',
  'Load failed',
  'Failed to fetch',
]

/**
 * HTTP status codes that represent expected user-facing states, not backend bugs.
 * 429 is included because the app uses @nestjs/throttler - rate limit hits are expected.
 */
export const SENTRY_IGNORE_HTTP_STATUS_CODES: number[] = [
  400, 401, 403, 404, 429,
]
