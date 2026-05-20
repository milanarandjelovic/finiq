import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import * as Sentry from '@sentry/nestjs'

import { SentryFilter } from '@/providers/sentry/filters/sentry.filter'

jest.mock('@sentry/nestjs', () => ({
  withScope: jest.fn(),
  captureException: jest.fn(),
}))

jest.mock('@finiq/sentry', () => ({
  SENTRY_IGNORE_HTTP_STATUS_CODES: [400, 401, 403, 404, 429],
}))

describe('SentryFilter', () => {
  let filter: SentryFilter
  let mockResponse: { status: jest.Mock; json: jest.Mock }
  let mockRequest: {
    url: string
    method: string
    query: object
    params: object
  }
  let mockHost: any
  let mockScope: { setTag: jest.Mock; setExtra: jest.Mock }

  beforeEach(() => {
    filter = new SentryFilter()
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    mockRequest = { url: '/api/test', method: 'GET', query: {}, params: {} }
    mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    }
    mockScope = { setTag: jest.fn(), setExtra: jest.fn() }
    ;(Sentry.withScope as jest.Mock).mockImplementation((cb) => cb(mockScope))
    jest.clearAllMocks()
    ;(Sentry.withScope as jest.Mock).mockImplementation((cb) => cb(mockScope))
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
  })

  describe('catch', () => {
    it('should respond with status and body directly for ignored HTTP status codes', () => {
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND)

      filter.catch(exception, mockHost)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith(exception.getResponse())
      expect(Sentry.withScope).not.toHaveBeenCalled()
    })

    it('should call Sentry.withScope for non-ignored HTTP exceptions', () => {
      const exception = new HttpException(
        'Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )

      filter.catch(exception, mockHost)

      expect(Sentry.withScope).toHaveBeenCalled()
      expect(mockScope.setTag).toHaveBeenCalledWith('url', '/api/test')
      expect(mockScope.setTag).toHaveBeenCalledWith('method', 'GET')
      expect(Sentry.captureException).toHaveBeenCalledWith(exception)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
    })

    it('should call Sentry.withScope and respond with 500 for non-HTTP exceptions', () => {
      const exception = new Error('Unexpected error')

      filter.catch(exception, mockHost)

      expect(Sentry.withScope).toHaveBeenCalled()
      expect(Sentry.captureException).toHaveBeenCalledWith(exception)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Internal server error',
      })
    })

    it('should use the HTTP exception status code in the response for non-ignored codes', () => {
      const exception = new HttpException(
        'Payment Required',
        HttpStatus.PAYMENT_REQUIRED,
      )

      filter.catch(exception, mockHost)

      expect(mockResponse.status).toHaveBeenCalledWith(402)
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 402,
        message: 'Internal server error',
      })
    })
  })
})
