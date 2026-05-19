import * as Sentry from '@sentry/nestjs'
import { of } from 'rxjs'

import { SentryInterceptor } from '@/providers/sentry/interceptors/sentry.interceptor'

jest.mock('@sentry/nestjs', () => ({
  getCurrentScope: jest.fn(),
}))

const makeContext = (method = 'GET', url = '/test') =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ method, url }),
    }),
  }) as any

const makeHandler = () => ({ handle: jest.fn(() => of(null)) }) as any

describe('SentryInterceptor', () => {
  let interceptor: SentryInterceptor
  let mockScope: { setTag: jest.Mock }

  beforeEach(() => {
    interceptor = new SentryInterceptor()
    mockScope = { setTag: jest.fn() }
    ;(Sentry.getCurrentScope as jest.Mock).mockReturnValue(mockScope)
  })

  it('should set http.method tag on the current scope', () => {
    interceptor.intercept(makeContext('POST', '/api'), makeHandler())

    expect(mockScope.setTag).toHaveBeenCalledWith('http.method', 'POST')
  })

  it('should set http.url tag on the current scope', () => {
    interceptor.intercept(makeContext('GET', '/api/locales'), makeHandler())

    expect(mockScope.setTag).toHaveBeenCalledWith('http.url', '/api/locales')
  })

  it('should call next.handle and return its observable', (done) => {
    const handler = makeHandler()
    const result$ = interceptor.intercept(makeContext(), handler)

    expect(handler.handle).toHaveBeenCalled()
    result$.subscribe({ complete: done })
  })
})
