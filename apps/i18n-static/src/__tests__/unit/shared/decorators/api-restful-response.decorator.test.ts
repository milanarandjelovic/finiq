import { HttpStatus } from '@nestjs/common'

import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'

class TestDto {
  name: string
}

class AnotherDto {
  id: number
}

describe('ApiRestfulResponse', () => {
  it('should apply decorator for 2xx success response without error', () => {
    const decorator = ApiRestfulResponse({
      model: TestDto,
      status: HttpStatus.OK,
      description: 'Success',
    })

    expect(decorator).toBeDefined()
    expect(typeof decorator).toBe('function')
  })

  it('should apply decorator for 4xx error response without error', () => {
    const decorator = ApiRestfulResponse({
      model: TestDto,
      status: HttpStatus.NOT_FOUND,
      description: 'Not found',
    })

    expect(decorator).toBeDefined()
    expect(typeof decorator).toBe('function')
  })

  it('should apply decorator with array of models for non-2xx', () => {
    const decorator = ApiRestfulResponse({
      model: [TestDto, AnotherDto],
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation error',
    })

    expect(decorator).toBeDefined()
    expect(typeof decorator).toBe('function')
  })

  it('should do nothing for 2xx with array model', () => {
    const decorator = ApiRestfulResponse({
      model: [TestDto, AnotherDto],
      status: HttpStatus.OK,
      description: 'Success',
    })

    expect(decorator).toBeUndefined()
  })
})
