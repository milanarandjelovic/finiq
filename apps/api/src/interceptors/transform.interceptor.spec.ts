import { Reflector } from '@nestjs/core'
import { of } from 'rxjs'

import { TransformInterceptor } from '@/interceptors/transform.interceptor'

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>
  let reflector: jest.Mocked<Reflector>

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
      getAll: jest.fn(),
      getAllAndOverride: jest.fn(),
    } as any
    interceptor = new TransformInterceptor(reflector)
  })

  it('should wrap response in standard envelope', (done) => {
    const mockResponse = { statusCode: 200 }
    const context = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any
    const next = { handle: () => of({ message: 'ok', data: { foo: 'bar' } }) }

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({
        statusCode: 200,
        message: 'ok',
        data: { foo: 'bar' },
      })
      done()
    })
  })

  it('should read statusCode from response', (done) => {
    const mockResponse = { statusCode: 201 }
    const context = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any
    const next = { handle: () => of({ message: 'created', data: null }) }

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result.statusCode).toBe(201)
      done()
    })
  })

  it('should handle null data', (done) => {
    const mockResponse = { statusCode: 200 }
    const context = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any
    const next = { handle: () => of({ message: 'no content', data: null }) }

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result.data).toBeNull()
      done()
    })
  })
})
