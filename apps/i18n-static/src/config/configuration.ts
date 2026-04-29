import type { ConfigFactory } from '@nestjs/config/dist/interfaces'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

import type { Configuration } from '@/config/interfaces/configuration.interface'

expand(config())

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num

const configuration: Configuration = {
  // App Version
  appVersion: process.env.APP_VERSION || '1.0.0',

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
    title: 'Finiq i18n Static',
    description: 'API for serving language translation files',
    version: process.env.APP_VERSION || '1.0.0',
    path: 'docs',
  },

  // Throttler Configuration
  throttler: {
    global: {
      limit: int(process.env.THROTTLE_GLOBAL_LIMIT, 100),
      ttl: int(process.env.THROTTLE_GLOBAL_TTL, 60000),
    },
  },
}

const configFunction: ConfigFactory<Configuration> = () => configuration

export default configFunction
