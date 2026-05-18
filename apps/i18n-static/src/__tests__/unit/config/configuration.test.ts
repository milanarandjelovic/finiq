import configuration from '@/config/configuration'
import type { Configuration } from '@/config/interfaces/configuration.interface'

describe('Configuration', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.APP_VERSION
    delete process.env.CORS_ENABLED
    delete process.env.CORS_ORIGINS
    delete process.env.THROTTLE_GLOBAL_LIMIT
    delete process.env.THROTTLE_GLOBAL_TTL
    delete process.env.SENTRY_DSN
    delete process.env.SENTRY_ENABLED
    delete process.env.NODE_ENV
    delete process.env.SENTRY_TRACES_SAMPLE_RATE
    delete process.env.SENTRY_RELEASE
    delete process.env.SENTRY_ENABLE_LOGS
    delete process.env.SENTRY_PROFILE_LIFECYCLE
    delete process.env.SENTRY_SEND_DEFAULT_PII
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('should return default values when no env vars are set', () => {
    const config = configuration() as Configuration

    expect(config.appVersion).toBe('1.0.0')
    expect(config.cors.enabled).toBe(false)
    expect(config.cors.origins).toEqual([])
    expect(config.swagger.title).toBe('Finiq i18n Static')
    expect(config.swagger.description).toBe(
      'API for serving language translation files',
    )
    expect(config.throttler.global.limit).toBe(100)
    expect(config.throttler.global.ttl).toBe(60000)
  })

  it('should read APP_VERSION from env', () => {
    process.env.APP_VERSION = '2.0.0'
    const config = configuration() as Configuration

    expect(config.appVersion).toBe('2.0.0')
  })

  it('should enable CORS when CORS_ENABLED=true', () => {
    process.env.CORS_ENABLED = 'true'
    const config = configuration() as Configuration

    expect(config.cors.enabled).toBe(true)
  })

  it('should parse CORS_ORIGINS from comma-separated string', () => {
    process.env.CORS_ENABLED = 'true'
    process.env.CORS_ORIGINS = 'http://localhost:3000,http://localhost:8081'
    const config = configuration() as Configuration

    expect(config.cors.origins).toEqual([
      'http://localhost:3000',
      'http://localhost:8081',
    ])
  })

  it('should handle empty CORS_ORIGINS when CORS is enabled', () => {
    process.env.CORS_ENABLED = 'true'
    const config = configuration() as Configuration

    expect(config.cors.origins).toEqual([])
  })

  it('should parse throttler values from env', () => {
    process.env.THROTTLE_GLOBAL_LIMIT = '50'
    process.env.THROTTLE_GLOBAL_TTL = '30000'
    const config = configuration() as Configuration

    expect(config.throttler.global.limit).toBe(50)
    expect(config.throttler.global.ttl).toBe(30000)
  })

  it('should fall back to defaults for invalid throttler env values', () => {
    process.env.THROTTLE_GLOBAL_LIMIT = 'not-a-number'
    const config = configuration() as Configuration

    expect(config.throttler.global.limit).toBe(100)
  })

  it('should return default sentry values when no env vars are set', () => {
    const config = configuration() as Configuration

    expect(config.sentry.dsn).toBe('')
    expect(config.sentry.enabled).toBe(false)
    expect(config.sentry.environment).toBe('development')
    expect(config.sentry.tracesSampleRate).toBe(0.1)
    expect(config.sentry.enableLogs).toBe(false)
    expect(config.sentry.profileLifecycle).toBe('trace')
    expect(config.sentry.sendDefaultPii).toBe(false)
  })

  it('should read sentry config from env', () => {
    process.env.SENTRY_DSN = 'https://test@sentry.io/123'
    process.env.SENTRY_ENABLED = 'true'
    process.env.NODE_ENV = 'production'
    process.env.SENTRY_TRACES_SAMPLE_RATE = '0.5'
    process.env.SENTRY_ENABLE_LOGS = 'true'
    process.env.SENTRY_PROFILE_LIFECYCLE = 'manual'
    process.env.SENTRY_SEND_DEFAULT_PII = 'true'

    const config = configuration() as Configuration

    expect(config.sentry.dsn).toBe('https://test@sentry.io/123')
    expect(config.sentry.enabled).toBe(true)
    expect(config.sentry.environment).toBe('production')
    expect(config.sentry.tracesSampleRate).toBe(0.5)
    expect(config.sentry.enableLogs).toBe(true)
    expect(config.sentry.profileLifecycle).toBe('manual')
    expect(config.sentry.sendDefaultPii).toBe(true)
  })
})
