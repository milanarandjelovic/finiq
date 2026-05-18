import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import * as Sentry from '@sentry/nestjs'
import type { Request } from 'express'
import type { Observable } from 'rxjs'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>()

    Sentry.getCurrentScope().setTag('http.method', request.method)
    Sentry.getCurrentScope().setTag('http.url', request.url)

    const user = request.user as { id?: string; email?: string } | undefined

    if (user?.id) {
      Sentry.setUser({ id: user.id, email: user.email })
    }

    return next.handle()
  }
}
