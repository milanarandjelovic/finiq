import type { RedocOptions } from '@jozefazz/nestjs-redoc'
import { RedocModule } from '@jozefazz/nestjs-redoc'
import type { LogLevel } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'

import { AppModule } from '@/modules/app/app.module'

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production'
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'debug', 'verbose']

  const app = await NestFactory.create(AppModule, { logger: logLevels })

  const PORT = process.env.PORT ?? 4001

  // Logger
  app.useLogger(app.get(Logger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  app.use(helmet())

  // CORS
  const corsEnabled = process.env.CORS_ENABLED === 'true'
  if (corsEnabled) {
    const origins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
      : []
    app.enableCors({ origin: origins })
  }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Finiq i18n Static')
    .setDescription('API for serving language translation files')
    .setVersion(process.env.APP_VERSION || '1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  const httpAdapter = app.getHttpAdapter()
  httpAdapter.get('/swagger.json', (req, res) => {
    res.json(document)
  })

  const redocOptions: RedocOptions = {
    title: 'Finiq i18n Static Documentation',
    sortPropsAlphabetically: true,
    hideDownloadButton: true,
    hideHostname: false,
    auth: {
      enabled: true,
      user: process.env.DOCS_AUTH_USER ?? 'private',
      password: process.env.DOCS_AUTH_PASSWORD ?? 'folder',
    },
    docName: '/swagger',
  }

  await RedocModule.setup('docs', app as any, document, redocOptions)

  await app.listen(PORT)

  console.log(`i18n-static server running on http://localhost:${PORT}`)
}

bootstrap()
