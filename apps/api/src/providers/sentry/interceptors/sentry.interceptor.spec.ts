import * as Sentry from '@sentry/nestjs'
import { of } from 'rxjs'

import { SentryInterceptor } from '@/providers/sentry/interceptors/sentry.interceptor'

jest.mock('@sentry/nestjs', () => ({
  getCurrentScope: jest.fn(),
  setUser: jest.fn(),
}))

describe('SentryInterceptor', () => {
  let interceptor: SentryInterceptor
  let mockSetTag: jest.Mock

  beforeEach(() => {
    interceptor = new SentryInterceptor()
    mockSetTag = jest.fn()
    jest.mocked(Sentry.getCurrentScope).mockReturnValue({
      setTag: mockSetTag,
    } as any)
    jest.clearAllMocks()
    jest.mocked(Sentry.getCurrentScope).mockReturnValue({
      setTag: mockSetTag,
    } as any)
  })

  describe('intercept', () => {
    it('should set HTTP method and URL tags on the Sentry scope', () => {
      const request = { method: 'GET', url: '/api/test', user: undefined }
      const context = {
        switchToHttp: () => ({ getRequest: () => request }),
      } as any
      const next = { handle: () => of('response') }

      interceptor.intercept(context, next)

      expect(mockSetTag).toHaveBeenCalledWith('http.method', 'GET')
      expect(mockSetTag).toHaveBeenCalledWith('http.url', '/api/test')
    })

    it('should call Sentry.setUser when request has a user with id', () => {
      const request = {
        method: 'POST',
        url: '/api/auth',
        user: { id: 'user-1', email: 'test@test.com' },
      }
      const context = {
        switchToHttp: () => ({ getRequest: () => request }),
      } as any
      const next = { handle: () => of('response') }

      interceptor.intercept(context, next)

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: 'user-1',
        email: 'test@test.com',
      })
    })

    it('should not call Sentry.setUser when request has no user', () => {
      const request = { method: 'GET', url: '/api/public', user: undefined }
      const context = {
        switchToHttp: () => ({ getRequest: () => request }),
      } as any
      const next = { handle: () => of('response') }

      interceptor.intercept(context, next)

      expect(Sentry.setUser).not.toHaveBeenCalled()
    })

    it('should return the observable from next.handle()', () => {
      const request = { method: 'GET', url: '/api/test', user: undefined }
      const context = {
        switchToHttp: () => ({ getRequest: () => request }),
      } as any
      const observable = of('data')
      const next = { handle: () => observable }

      const result = interceptor.intercept(context, next)

      expect(result).toBe(observable)
    })
  })
})
