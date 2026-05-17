import { LANG_DEFAULT_LOCALES } from '@finiq/translations'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ClsModule } from 'nestjs-cls'
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { LoggerModule } from 'nestjs-pino'

import configuration from '@/config/configuration'
import { Configuration } from '@/config/interfaces/configuration.interface'
import { ValidationFilter } from '@/filters/validation.filter'
import { AppController } from '@/modules/app/controllers/app.controller'
import { AppService } from '@/modules/app/services/app.service'
import { AuthModule } from '@/modules/auth/auth.module'
import { AppThrottlerGuard } from '@/modules/auth/guards/app-throttler.guard'
import { BudgetModule } from '@/modules/budget/budget.module'
import { CategoryModule } from '@/modules/category/category.module'
import { DashboardModule } from '@/modules/dashboard/dashboard.module'
import { SettingModule } from '@/modules/setting/setting.module'
import { StatisticsModule } from '@/modules/statistics/statistics.module'
import { TransactionModule } from '@/modules/transaction/transaction.module'
import { UserModule } from '@/modules/user/user.module'
import { typeormConfig } from '@/providers/db/typeorm.config'
import { EmailModule } from '@/providers/email/email.module'
import { JsonTranslationsLoader } from '@/providers/i18n/json-translations.loader'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
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
          {
            name: 'auth',
            ttl: t.auth.ttl,
            limit: t.auth.limit,
          },
          {
            name: 'sensitive',
            ttl: t.sensitive.ttl,
            limit: t.sensitive.limit,
          },
        ]
      },
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: LANG_DEFAULT_LOCALES,
      loader: JsonTranslationsLoader,
      loaderOptions: {},
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-lang']),
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => typeormConfig,
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
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers.user',
            'err.config.headers.authorization',
            'err.config.headers.cookie',
            'err.config.headers.user',
          ],
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
    EmailModule.forRoot({
      useFactory: (configService: ConfigService) => {
        const emailConfig = configService.get<Configuration['email']>('email')

        return {
          host: emailConfig.host,
          port: emailConfig.port,
          auth: {
            user: emailConfig.username,
            pass: emailConfig.password,
          },
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    TransactionModule,
    BudgetModule,
    SettingModule,
    DashboardModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ValidationFilter,
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
  ],
})
export class AppModule {}
