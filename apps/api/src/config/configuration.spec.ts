import configuration from '@/config/configuration'
import type { Configuration } from '@/config/interfaces/configuration.interface'

describe('Configuration', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.CORS_ENABLED
    delete process.env.CORS_ORIGINS
    delete process.env.CLIENT_URL
    delete process.env.THROTTLE_GLOBAL_LIMIT
    delete process.env.THROTTLE_GLOBAL_TTL
    delete process.env.THROTTLE_AUTH_LIMIT
    delete process.env.THROTTLE_AUTH_TTL
    delete process.env.THROTTLE_SENSITIVE_LIMIT
    delete process.env.THROTTLE_SENSITIVE_TTL
    delete process.env.MAIL_TRANSPORT_HOST
    delete process.env.MAIL_TRANSPORT_PORT
    delete process.env.MAIL_TRANSPORT_USER
    delete process.env.MAIL_TRANSPORT_PASS
    delete process.env.MAIL_FROM
    delete process.env.JWT_ACCESS_SECRET
    delete process.env.JWT_REFRESH_SECRET
    delete process.env.ROOM_DISPLAY_JWT_SECRET
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('should set clientUrl default', () => {
    const config = configuration() as Configuration

    expect(config.clientUrl).toBe('http://localhost:3000')
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
    process.env.THROTTLE_AUTH_LIMIT = '10'
    process.env.THROTTLE_AUTH_TTL = '60000'
    process.env.THROTTLE_SENSITIVE_LIMIT = '5'
    process.env.THROTTLE_SENSITIVE_TTL = '120000'
    const config = configuration() as Configuration

    expect(config.throttler.global.limit).toBe(50)
    expect(config.throttler.global.ttl).toBe(30000)
    expect(config.throttler.auth.limit).toBe(10)
    expect(config.throttler.sensitive.limit).toBe(5)
  })

  it('should fall back to defaults for invalid throttler env values', () => {
    process.env.THROTTLE_GLOBAL_LIMIT = 'not-a-number'
    const config = configuration() as Configuration

    expect(config.throttler.global.limit).toBe(100)
  })

  it('should use empty string for sentry DSN when SENTRY_DSN is not set', () => {
    delete process.env.SENTRY_DSN
    const config = configuration() as Configuration

    expect(config.sentry.dsn).toBe('')
  })

  it('should use SENTRY_DSN value when set', () => {
    process.env.SENTRY_DSN = 'https://key@sentry.io/123'
    const config = configuration() as Configuration

    expect(config.sentry.dsn).toBe('https://key@sentry.io/123')
    delete process.env.SENTRY_DSN
  })

  it('should default sentry environment to development when NODE_ENV is not set', () => {
    const saved = process.env.NODE_ENV
    delete process.env.NODE_ENV
    const config = configuration() as Configuration

    expect(config.sentry.environment).toBe('development')
    process.env.NODE_ENV = saved
  })

  it('should use SENTRY_TRACES_SAMPLE_RATE when set', () => {
    process.env.SENTRY_TRACES_SAMPLE_RATE = '0.5'
    const config = configuration() as Configuration

    expect(config.sentry.tracesSampleRate).toBe(0.5)
    delete process.env.SENTRY_TRACES_SAMPLE_RATE
  })

  it('should default sentry tracesSampleRate to 0.1 when SENTRY_TRACES_SAMPLE_RATE is not set', () => {
    delete process.env.SENTRY_TRACES_SAMPLE_RATE
    const config = configuration() as Configuration

    expect(config.sentry.tracesSampleRate).toBe(0.1)
  })

  it('should use SENTRY_RELEASE when set', () => {
    process.env.SENTRY_RELEASE = 'v1.2.3'
    const config = configuration() as Configuration

    expect(config.sentry.release).toBe('v1.2.3')
    delete process.env.SENTRY_RELEASE
  })

  it('should fall back to npm_package_version when SENTRY_RELEASE is not set', () => {
    delete process.env.SENTRY_RELEASE
    process.env.npm_package_version = '2.0.0'
    const config = configuration() as Configuration

    expect(config.sentry.release).toBe('2.0.0')
    delete process.env.npm_package_version
  })

  it('should default profileLifecycle to trace when SENTRY_PROFILE_LIFECYCLE is not set', () => {
    delete process.env.SENTRY_PROFILE_LIFECYCLE
    const config = configuration() as Configuration

    expect(config.sentry.profileLifecycle).toBe('trace')
  })

  it('should use SENTRY_PROFILE_LIFECYCLE when set', () => {
    process.env.SENTRY_PROFILE_LIFECYCLE = 'manual'
    const config = configuration() as Configuration

    expect(config.sentry.profileLifecycle).toBe('manual')
    delete process.env.SENTRY_PROFILE_LIFECYCLE
  })

  it('should propagate email config from env', () => {
    process.env.MAIL_TRANSPORT_HOST = 'smtp.example.com'
    process.env.MAIL_TRANSPORT_PORT = '587'
    process.env.MAIL_TRANSPORT_USER = 'user'
    process.env.MAIL_TRANSPORT_PASS = 'pass'
    process.env.MAIL_FROM = 'noreply@example.com'
    const config = configuration() as Configuration

    expect(config.email.host).toBe('smtp.example.com')
    expect(config.email.port).toBe(587)
    expect(config.email.username).toBe('user')
    expect(config.email.password).toBe('pass')
    expect(config.email.from).toBe('noreply@example.com')
  })
})
