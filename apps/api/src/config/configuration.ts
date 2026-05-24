import type { ConfigFactory } from '@nestjs/config/dist/interfaces'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

import {
  APPLICATION_API_VERSION,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from '@finiq/shared'
import type { Configuration } from '@/config/interfaces/configuration.interface'

expand(config())

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num

const configFunction: ConfigFactory<Configuration> = () => ({
  // App Version
  appVersion: APPLICATION_API_VERSION,

  // Client URL
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  // CORS Configuration
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
      : [],
  },

  // Swagger Configuration
  swagger: {
    enabled: true,
    title: 'Finiq API',
    description: 'API documentation for Finiq App',
    version: APPLICATION_API_VERSION,
    path: 'docs',
  },

  // JWT Configuration
  jwt: {
    secretOrKey: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: JWT_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
  },

  // Room Display JWT Configuration
  roomDisplayJwt: {
    secret: process.env.ROOM_DISPLAY_JWT_SECRET,
  },

  // Email Configuration
  email: {
    host: process.env.MAIL_TRANSPORT_HOST,
    port: int(process.env.MAIL_TRANSPORT_PORT, 255),
    username: process.env.MAIL_TRANSPORT_USER,
    password: process.env.MAIL_TRANSPORT_PASS,
    from: process.env.MAIL_FROM,
  },

  // Throttler Configuration
  throttler: {
    global: {
      limit: int(process.env.THROTTLE_GLOBAL_LIMIT, 100),
      ttl: int(process.env.THROTTLE_GLOBAL_TTL, 60000),
    },
    auth: {
      limit: int(process.env.THROTTLE_AUTH_LIMIT, 10),
      ttl: int(process.env.THROTTLE_AUTH_TTL, 60000),
    },
    sensitive: {
      limit: int(process.env.THROTTLE_SENSITIVE_LIMIT, 5),
      ttl: int(process.env.THROTTLE_SENSITIVE_TTL, 60000),
    },
  },

  // Sentry Configuration
  sentry: {
    dsn: process.env.SENTRY_DSN ?? '',
    enabled: process.env.SENTRY_ENABLED === 'true',
    environment: process.env.NODE_ENV ?? 'development',
    // Use || not ?? - empty string passes through ?? and parseFloat('') returns NaN
    tracesSampleRate: parseFloat(
      process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1',
    ),
    release: process.env.SENTRY_RELEASE ?? process.env.npm_package_version,
    enableLogs: process.env.SENTRY_ENABLE_LOGS === 'true',
    profileLifecycle:
      (process.env.SENTRY_PROFILE_LIFECYCLE as 'trace' | 'manual') ?? 'trace',
    sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
  },
})

export default configFunction
