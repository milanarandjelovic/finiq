import { SENTRY_IGNORE_HTTP_STATUS_CODES } from '@finiq/sentry'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import * as Sentry from '@sentry/nestjs'
import type { Request, Response } from 'express'

@Catch()
export class SentryFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()

      if (SENTRY_IGNORE_HTTP_STATUS_CODES.includes(status)) {
        response.status(status).json(exception.getResponse())

        return
      }
    }

    Sentry.withScope((scope) => {
      scope.setTag('url', request.url)
      scope.setTag('method', request.method)
      scope.setExtra('query', request.query)
      scope.setExtra('params', request.params)

      Sentry.captureException(exception)
    })

    this.logger.error(exception)

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500

    response.status(statusCode).json({
      statusCode,
      message: 'Internal server error',
    })
  }
}
