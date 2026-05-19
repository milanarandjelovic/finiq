import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import * as Sentry from '@sentry/nestjs'

import { SENTRY_IGNORE_HTTP_STATUS_CODES } from '@finiq/sentry'
import { SentryFilter } from '@/providers/sentry/filters/sentry.filter'

jest.mock('@sentry/nestjs', () => ({
  withScope: jest.fn(),
  captureException: jest.fn(),
}))

const makeHost = (url = '/test', method = 'GET') => {
  const json = jest.fn()
  const status = jest.fn(() => ({ json }))

  return {
    host: {
      switchToHttp: () => ({
        getRequest: () => ({ url, method, query: {}, params: {} }),
        getResponse: () => ({ status }),
      }),
    } as any,
    status,
    json,
  }
}

describe('SentryFilter', () => {
  let filter: SentryFilter
  let mockScope: { setTag: jest.Mock; setExtra: jest.Mock }

  beforeEach(() => {
    mockScope = { setTag: jest.fn(), setExtra: jest.fn() }
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
    ;(Sentry.withScope as jest.Mock).mockImplementation((cb) => cb(mockScope))
    filter = new SentryFilter()
  })

  describe('ignored HTTP status codes', () => {
    it('should respond directly and skip Sentry for ignored status codes', () => {
      const ignoredStatus = SENTRY_IGNORE_HTTP_STATUS_CODES[0]
      const exception = new HttpException('Not found', ignoredStatus)
      const { host, status, json } = makeHost()

      filter.catch(exception, host)

      expect(status).toHaveBeenCalledWith(ignoredStatus)
      expect(json).toHaveBeenCalledWith(exception.getResponse())
      expect(Sentry.withScope).not.toHaveBeenCalled()
    })
  })

  describe('non-ignored HttpException', () => {
    it('should capture exception via Sentry and respond with correct status', () => {
      const exception = new HttpException(
        'Server error',
        HttpStatus.BAD_GATEWAY,
      )
      const { host, status } = makeHost()

      filter.catch(exception, host)

      expect(Sentry.withScope).toHaveBeenCalled()
      expect(Sentry.captureException).toHaveBeenCalledWith(exception)
      expect(status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY)
    })
  })

  describe('non-HttpException errors', () => {
    it('should respond with 500 for unknown errors', () => {
      const exception = new Error('Unexpected crash')
      const { host, status, json } = makeHost()

      filter.catch(exception, host)

      expect(status).toHaveBeenCalledWith(500)
      expect(json).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Internal server error',
      })
    })

    it('should capture unknown errors via Sentry', () => {
      const exception = new Error('Unexpected crash')
      const { host } = makeHost()

      filter.catch(exception, host)

      expect(Sentry.withScope).toHaveBeenCalled()
      expect(Sentry.captureException).toHaveBeenCalledWith(exception)
    })
  })

  describe('Sentry scope tags', () => {
    it('should set url and method tags on the scope', () => {
      const exception = new Error('crash')
      const { host } = makeHost('/api/test', 'POST')

      filter.catch(exception, host)

      expect(mockScope.setTag).toHaveBeenCalledWith('url', '/api/test')
      expect(mockScope.setTag).toHaveBeenCalledWith('method', 'POST')
    })
  })
})
