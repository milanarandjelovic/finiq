export interface Configuration {
  // App Version
  appVersion: string

  // CORS Configuration
  cors: {
    enabled: boolean
    origins: string[]
  }

  // Swagger Configuration
  swagger: {
    enabled: boolean
    title: string
    description: string
    version: string
    path: string
  }

  // Throttler Configuration
  throttler: {
    global: {
      limit: number
      ttl: number
    }
  }

  // Sentry Configuration
  sentry: {
    dsn: string
    enabled: boolean
    environment: string
    tracesSampleRate: number
    release?: string
    enableLogs: boolean
    profileLifecycle: 'trace' | 'manual'
    sendDefaultPii: boolean
  }
}
