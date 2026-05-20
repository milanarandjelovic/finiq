import { HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { ValidationException } from '@/exceptions/validation.exception'
import { ValidationFilter } from '@/filters/validation.filter'

describe('ValidationFilter', () => {
  let filter: ValidationFilter
  let i18nService: jest.Mocked<I18nService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationFilter,
        {
          provide: I18nService,
          useValue: { translate: jest.fn() },
        },
      ],
    }).compile()

    filter = module.get<ValidationFilter>(ValidationFilter)
    i18nService = module.get(I18nService)
  })

  it('should return 400 with translated error messages', () => {
    i18nService.translate.mockReturnValue('User not found')

    const exception = new ValidationException([
      { property: 'email', messages: ['api.authUserNotFound'] },
    ])
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const mockResponse = { status }
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    }

    jest.spyOn(I18nContext, 'current').mockReturnValue({ lang: 'en' } as any)

    filter.catch(exception, host as any)

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation Exception',
      errors: [{ property: 'email', messages: ['User not found'] }],
    })
  })

  it('should handle compound message key with JSON args', () => {
    i18nService.translate.mockImplementation((key: string) => {
      if (key === 'api.validationError') {
        return 'Translated'
      }

      return key
    })

    const exception = new ValidationException([
      {
        property: 'name',
        messages: ['api.validationError|{"field":"name"}'],
      },
    ])
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const mockResponse = { status }
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    }

    filter.catch(exception, host as any)

    expect(i18nService.translate).toHaveBeenCalledWith(
      'api.validationError',
      expect.objectContaining({
        args: { field: 'name' },
      }),
    )
  })

  it('should handle compound message with invalid JSON args gracefully', () => {
    i18nService.translate.mockImplementation((key: string) => {
      if (key === 'api.simpleKey') {
        return 'Translated'
      }

      return key
    })

    const exception = new ValidationException([
      {
        property: 'name',
        messages: ['api.simpleKey|{invalid-json}'],
      },
    ])
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const mockResponse = { status }
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    }

    filter.catch(exception, host as any)

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [{ property: 'name', messages: ['Translated'] }],
      }),
    )
  })
})
