import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { LoggerModule } from 'nestjs-pino'

import configuration from '@/config/configuration'
import { Configuration } from '@/config/interfaces/configuration.interface'
import { HttpExceptionFilter } from '@/filters/http-exception.filter'
import { AppController } from '@/modules/app/controllers/app.controller'
import { AppService } from '@/modules/app/services/app.service'
import { LocalesModule } from '@/modules/locales/locales.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const t = configService.get<Configuration['throttler']>('throttler')
        return [
          {
            name: 'global',
            ttl: t.global.ttl,
            limit: t.global.limit,
          },
        ]
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      exclude: ['status'],
      pinoHttp: {
        timestamp: true,
        customProps: () => ({
          context: 'HTTP',
        }),
        formatters: {
          level: (label) => {
            return { level: label }
          },
        },
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
        },
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  levelFirst: true,
                  singleLine: true,
                  sync: true,
                },
              },
      },
    }),
    LocalesModule,
  ],
  controllers: [AppController],
  providers: [AppService, HttpExceptionFilter],
})
export class AppModule {}
