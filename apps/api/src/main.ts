import type { RedocOptions } from '@jozefazz/nestjs-redoc'
import { RedocModule } from '@jozefazz/nestjs-redoc'
import type { LogLevel } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { ValidationError } from 'class-validator'
import { useContainer } from 'class-validator'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'

import type { Configuration } from '@/config/interfaces/configuration.interface'
import { ValidationException } from '@/exceptions/validation.exception'
import { ValidationFilter } from '@/filters/validation.filter'
import { AppModule } from '@/modules/app/app.module'

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production'
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'debug', 'verbose']

  const app = await NestFactory.create(AppModule, { logger: logLevels })

  // Set port
  const PORT = process.env.PORT ?? 4000

  // Configuration
  const configService = app.get(ConfigService)
  const corsConfig = configService.get<Configuration['cors']>('cors')
  const swaggerConfig = configService.get<Configuration['swagger']>('swagger')

  // Logger
  app.useLogger(app.get(Logger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  app.use(cookieParser())

  app.use(helmet())

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  })

  // Set cors if enabled
  if (corsConfig.enabled) {
    app.enableCors({
      credentials: true,
      origin: corsConfig.origins,
    })
  }

  // ValidationFilter handles ValidationException specifically (more specific wins).
  app.useGlobalFilters(app.get(ValidationFilter))

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          return {
            property: error.property,
            messages: ([error.property] = [
              Object.values(error.constraints)[0],
            ]),
          }
        })

        return new ValidationException(messages)
      },
    }),
  )

  // Set swagger if enabled
  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Finiq App')
      .setDescription(swaggerConfig.description || 'Swagger description')
      .setVersion(swaggerConfig.version || '1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Login with email and password to get the authentication token',
        },
        'JwtToken',
      )
      .build()

    const document = SwaggerModule.createDocument(app, config)

    // Manually serve swagger JSON at a dedicated endpoint to handle /api prefix
    const httpAdapter = app.getHttpAdapter()
    httpAdapter.get('/swagger.json', (req, res) => {
      res.json(document)
    })

    const redocOptions: RedocOptions = {
      title: 'Finiq Documentation',
      sortPropsAlphabetically: true,
      hideDownloadButton: true,
      hideHostname: false,
      auth: {
        enabled: true,
        user: process.env.DOCS_AUTH_USER ?? 'private',
        password: process.env.DOCS_AUTH_PASSWORD ?? 'folder',
      },
      docName: '/api/swagger',
    }

    await RedocModule.setup('docs', app as any, document, redocOptions)
  }

  await app.listen(PORT)

  console.log(`Server running on http://localhost:${PORT}`)
}

bootstrap()
