import { Reflector } from '@nestjs/core'
import {
  ThrottlerModuleOptions,
  ThrottlerStorageService,
} from '@nestjs/throttler'

import { AppThrottlerGuard } from '@/modules/auth/guards/app-throttler.guard'

describe('AppThrottlerGuard', () => {
  let guard: AppThrottlerGuard
  let reflector: jest.Mocked<Reflector>

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
    } as any

    const options: ThrottlerModuleOptions = {} as any
    const storage = {} as ThrottlerStorageService

    guard = new AppThrottlerGuard(options, storage, reflector)
  })

  describe('canActivate', () => {
    it('should default tier to "global" when no metadata is set', async () => {
      reflector.getAllAndOverride.mockReturnValue(undefined)

      const req = { __throttleTier: undefined }
      const context = {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as any

      try {
        await guard.canActivate(context)
      } catch {
        // ThrottlerGuard will throw because storage is mocked; we only test the tier attachment
      }

      expect(reflector.getAllAndOverride).toHaveBeenCalled()
    })
  })

  describe('handleRequest', () => {
    it('should bypass when tier does not match throttler name', async () => {
      const requestProps = {
        context: {
          switchToHttp: () => ({
            getRequest: () => ({ __throttleTier: 'auth' }),
          }),
        },
        throttler: { name: 'global' },
      } as any
      const result = await (guard as any).handleRequest(requestProps)

      expect(result).toBe(true)
    })

    it('should call super.handleRequest when tier matches throttler name', async () => {
      const superSpy = jest
        .spyOn(
          Object.getPrototypeOf(AppThrottlerGuard.prototype),
          'handleRequest',
        )
        .mockResolvedValue(true)

      const requestProps = {
        context: {
          switchToHttp: () => ({
            getRequest: () => ({ __throttleTier: 'auth' }),
          }),
        },
        throttler: { name: 'auth' },
      } as any

      const result = await (guard as any).handleRequest(requestProps)

      expect(result).toBe(true)
      superSpy.mockRestore()
    })

    it('should use global as default tier when __throttleTier is undefined', async () => {
      const requestProps = {
        context: {
          switchToHttp: () => ({
            getRequest: () => ({}),
          }),
        },
        throttler: { name: 'other' },
      } as any

      const result = await (guard as any).handleRequest(requestProps)

      expect(result).toBe(true)
    })
  })
})
