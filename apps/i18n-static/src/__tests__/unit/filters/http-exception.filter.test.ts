import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { HttpExceptionFilter } from '@/filters/http-exception.filter'

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile()

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter)
  })

  it('should return 404 with message and path for NotFoundException', () => {
    const exception = new NotFoundException('Locale "xx" not found')
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const mockResponse = { status }
    const mockRequest = { url: '/locales/xx' }
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    }

    filter.catch(exception, host as any)

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Locale "xx" not found',
      path: '/locales/xx',
    })
  })

  it('should return 400 for BadRequestException', () => {
    const exception = new BadRequestException('Bad input')
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const mockResponse = { status }
    const mockRequest = { url: '/test' }
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    }

    filter.catch(exception, host as any)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Bad input',
      path: '/test',
    })
  })

  it('should include the request URL in path field', () => {
    const exception = new NotFoundException('Not found')
    const json = jest.fn()
    const status = jest.fn(() => ({ json }))
    const mockResponse = { status }
    const mockRequest = { url: '/locales/xx' }
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    }

    filter.catch(exception, host as any)

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/locales/xx' }),
    )
  })
})
