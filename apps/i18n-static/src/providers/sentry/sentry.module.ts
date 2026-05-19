import { DynamicModule, Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

import {
  createSentryConfig,
  isSentryEnabled,
  toSentryInitOptions,
} from '@finiq/sentry'
import type { Configuration } from '@/config/interfaces/configuration.interface'

@Global()
@Module({})
export class SentryModule {
  static forRoot(): DynamicModule {
    return {
      module: SentryModule,
      providers: [
        {
          provide: 'SENTRY_INITIALIZED',
          useFactory: (configService: ConfigService) => {
            const raw = configService.get<Configuration['sentry']>('sentry')
            const config = createSentryConfig(raw)
            const logger = new Logger('SentryModule')

            if (!isSentryEnabled(config)) {
              logger.warn(
                'Sentry is disabled or DSN is missing - skipping initialization',
              )

              return false
            }

            Sentry.init({
              ...toSentryInitOptions(config),
              integrations: [nodeProfilingIntegration()],
            })

            logger.log(`Sentry initialized (env: ${config.environment})`)

            return true
          },
          inject: [ConfigService],
        },
      ],
    }
  }
}
