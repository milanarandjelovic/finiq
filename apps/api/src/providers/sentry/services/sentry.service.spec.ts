import * as Sentry from '@sentry/nestjs'

import { SentryService } from '@/providers/sentry/services/sentry.service'

jest.mock('@sentry/nestjs', () => ({
  withScope: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
}))

describe('SentryService', () => {
  let service: SentryService

  beforeEach(() => {
    service = new SentryService()
    jest.clearAllMocks()
  })

  describe('captureException', () => {
    it('should call Sentry.withScope and captureException', () => {
      const error = new Error('test error')
      const mockScope = { setExtras: jest.fn() }
      jest
        .mocked(Sentry.withScope)
        .mockImplementation((cb: any) => cb(mockScope))

      service.captureException(error, { key: 'value' })

      expect(Sentry.withScope).toHaveBeenCalled()
      expect(mockScope.setExtras).toHaveBeenCalledWith({ key: 'value' })
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })

    it('should call captureException without extras when context is not provided', () => {
      const error = new Error('test')
      const mockScope = { setExtras: jest.fn() }
      jest
        .mocked(Sentry.withScope)
        .mockImplementation((cb: any) => cb(mockScope))

      service.captureException(error)

      expect(Sentry.withScope).toHaveBeenCalled()
      expect(mockScope.setExtras).not.toHaveBeenCalled()
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('captureMessage', () => {
    it('should call Sentry.captureMessage with message and level', () => {
      service.captureMessage('hello', 'warning')

      expect(Sentry.captureMessage).toHaveBeenCalledWith('hello', 'warning')
    })

    it('should default to info level when not specified', () => {
      service.captureMessage('hello')

      expect(Sentry.captureMessage).toHaveBeenCalledWith('hello', 'info')
    })
  })

  describe('setUser', () => {
    it('should call Sentry.setUser with user', () => {
      const user = { id: 'user-1', email: 'test@test.com' }
      service.setUser(user)

      expect(Sentry.setUser).toHaveBeenCalledWith(user)
    })

    it('should call Sentry.setUser with null to clear user', () => {
      service.setUser(null)

      expect(Sentry.setUser).toHaveBeenCalledWith(null)
    })
  })

  describe('setTag', () => {
    it('should call Sentry.setTag with key and value', () => {
      service.setTag('environment', 'production')

      expect(Sentry.setTag).toHaveBeenCalledWith('environment', 'production')
    })
  })
})
